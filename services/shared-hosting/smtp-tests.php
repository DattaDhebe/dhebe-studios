<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

use PHPMailer\PHPMailer\SMTP;

$smtpChecks = 0;
function smtp_check(bool $value, string $message): void {
    global $smtpChecks;
    $smtpChecks++;
    if (!$value) throw new RuntimeException('SMTP assertion failed: ' . $message);
}

$smtpSettings = ['mail_from' => 'support@dhebe.com', 'smtp_username' => 'support@dhebe.com', 'smtp_password' => 'synthetic-test-password'];
smtp_check(signup_smtp_config($smtpSettings) !== null, 'Valid implicit TLS configuration');
smtp_check(signup_smtp_config($smtpSettings + ['smtp_port' => 587, 'smtp_encryption' => 'tls']) !== null, 'Explicit STARTTLS configuration');
foreach ([
    ['mail_from' => 'sender@example.com'], ['smtp_username' => 'other@dhebe.com'],
    ['smtp_password' => ''], ['smtp_password' => []], ['smtp_password' => "password\r\nextra"],
    ['smtp_password' => "password\0extra"], ['smtp_host' => 'smtp.attacker.invalid'],
    ['smtp_host' => 'smtp.hostinger.com;localhost'], ['smtp_port' => 25], ['smtp_port' => '465'],
    ['smtp_encryption' => ''], ['smtp_encryption' => 'tls'], ['smtp_port' => 587],
] as $bad) smtp_check(signup_smtp_config(array_replace($smtpSettings, $bad)) === null, 'Unsafe configuration rejected');
smtp_check(signup_smtp_config(['mail_from' => 'support@dhebe.com']) === null, 'Legacy PHP-mail-only settings are insufficient');

$previousDirectory = getenv('DHEBE_SIGNUP_DIRECTORY');
$missingDependencies = sys_get_temp_dir() . '/dhebe-missing-mailer-' . bin2hex(random_bytes(8));
putenv('DHEBE_SIGNUP_DIRECTORY=' . $missingDependencies);
try {
    smtp_check(!signup_send_code('reader@example.com', '12345678', $smtpSettings), 'Missing private dependency fails closed without PHP mail fallback');
} finally {
    putenv($previousDirectory === false ? 'DHEBE_SIGNUP_DIRECTORY' : 'DHEBE_SIGNUP_DIRECTORY=' . $previousDirectory);
}

require __DIR__ . '/vendor/autoload.php';

class SignupRecordingSMTP extends SMTP {
    public array $events = [];
    public array $connection = [];
    private bool $open = false;
    public function __construct(private string $failure = '') {}
    public function connect($host, $port = null, $timeout = 30, $options = []) {
        $this->connection = compact('host', 'port', 'timeout', 'options');
        $this->events[] = 'connect';
        return $this->open = $this->failure !== 'connect';
    }
    public function connected() { return $this->open; }
    public function hello($host = '') {
        $this->server_caps = ['EHLO' => $host, 'STARTTLS' => true, 'AUTH' => ['LOGIN']];
        $this->events[] = 'hello';
        return true;
    }
    public function startTLS() { $this->events[] = 'tls'; return $this->failure !== 'tls'; }
    public function authenticate($username, $password, $authtype = null, $OAuth = null) {
        $this->events[] = 'auth';
        return $username === 'support@dhebe.com' && $password === 'synthetic-test-password' && $this->failure !== 'auth';
    }
    public function mail($from) { $this->events[] = 'from:' . $from; return $this->failure !== 'from'; }
    public function recipient($address, $dsn = '') { $this->events[] = 'to:' . $address; return $this->failure !== 'recipient'; }
    public function data($msg_data) { $this->events[] = 'data'; return $this->failure !== 'data'; }
    public function quit($close_on_error = true) { $this->open = false; return true; }
    public function close() { $this->open = false; }
}

foreach ([465 => 'ssl', 587 => 'tls'] as $port => $encryption) {
    $mail = signup_code_mailer('reader@example.com', '12345678', $smtpSettings + ['smtp_port' => $port, 'smtp_encryption' => $encryption]);
    smtp_check($mail->Timeout === 10 && $mail->getSMTPInstance()->Timelimit === 15, 'Bounded network timeouts');
    $smtp = new SignupRecordingSMTP();
    $mail->setSMTPInstance($smtp);
    smtp_check($mail->Mailer === 'smtp' && $mail->SMTPAuth && $mail->SMTPDebug === 0, 'Authenticated SMTP only, with debug disabled');
    smtp_check($mail->SMTPSecure === $encryption && !$mail->SMTPAutoTLS, 'Encryption is mandatory, not opportunistic');
    smtp_check($mail->SMTPOptions['ssl'] === ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false], 'Certificate verification cannot be disabled');
    ob_start();
    $result = signup_deliver_mail($mail);
    $output = ob_get_clean();
    smtp_check($result && $output === '', 'SMTP acceptance succeeds without printing mail or credentials');
    smtp_check(!$smtp->connected(), 'Connection is closed after delivery');
    smtp_check($smtp->connection['port'] === $port, 'Configured submission port');
    smtp_check($smtp->connection['host'] === ($port === 465 ? 'ssl://' : '') . 'smtp.hostinger.com', 'Only the trusted SMTP endpoint is used');
    smtp_check(in_array('auth', $smtp->events, true) && in_array('from:support@dhebe.com', $smtp->events, true), 'Authenticated and envelope sender alignment');
    smtp_check(in_array('to:reader@example.com', $smtp->events, true), 'Only the intended recipient');
    smtp_check(($port === 587) === in_array('tls', $smtp->events, true), 'STARTTLS before authentication where required');
    if ($port === 587) smtp_check(array_search('tls', $smtp->events) < array_search('auth', $smtp->events), 'Never authenticate over plaintext');
    $mime = $mail->getSentMIMEMessage();
    smtp_check(str_contains($mime, 'From: DhebeVoice <support@dhebe.com>'), 'Correct visible sender');
    smtp_check(str_contains($mime, 'Subject: Verify your DhebeVoice tester email') && str_contains($mime, '12345678'), 'Expected verification subject and code');
    smtp_check(str_contains($mime, '@www.dhebe.com>') && str_contains($mime, 'Date:'), 'Domain message ID and date');
    smtp_check(!str_contains($mime, 'synthetic-test-password') && !str_contains($mime, 'main-hosting.eu'), 'No credential or generic hosting identity in the message');
}

foreach (['connect', 'tls', 'auth', 'from', 'recipient', 'data'] as $failure) {
    $mail = signup_code_mailer('reader@example.com', '12345678', $smtpSettings + ['smtp_port' => 587, 'smtp_encryption' => 'tls']);
    $smtp = new SignupRecordingSMTP($failure);
    $mail->setSMTPInstance($smtp);
    ob_start();
    $result = signup_deliver_mail($mail);
    $output = ob_get_clean();
    smtp_check(!$result && $output === '' && !$smtp->connected(), 'Failure is private, closed, and never reported as queued: ' . $failure);
    if (in_array($failure, ['connect', 'tls', 'auth'], true)) smtp_check(!in_array('data', $smtp->events, true), 'Do not send content after connection/authentication failure');
    if ($failure === 'tls') smtp_check(!in_array('auth', $smtp->events, true), 'Failed TLS never downgrades to plaintext authentication');
}
smtp_check(!signup_send_code("reader@example.com\r\nBcc: other@example.com", '12345678', $smtpSettings), 'Header injection rejected');
smtp_check(!signup_send_code('reader@example.com', "12345678\r\n", $smtpSettings), 'Code injection rejected');
echo json_encode(['smtp_checks_passed' => $smtpChecks, 'network_messages_sent' => 0]) . PHP_EOL;
