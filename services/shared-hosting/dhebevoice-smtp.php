<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

function signup_smtp_config(array $settings): ?array {
    $from = signup_email($settings['mail_from'] ?? null);
    $username = signup_email($settings['smtp_username'] ?? null);
    $password = $settings['smtp_password'] ?? null;
    $host = $settings['smtp_host'] ?? 'smtp.hostinger.com';
    $port = $settings['smtp_port'] ?? 465;
    $encryption = $settings['smtp_encryption'] ?? 'ssl';
    if (!$from || !str_ends_with($from, '@dhebe.com') || $username !== $from
        || !is_string($password) || $password === '' || strlen($password) > 4096
        || preg_match('/[\x00\r\n]/', $password) || $host !== 'smtp.hostinger.com'
        || !(($port === 465 && $encryption === 'ssl') || ($port === 587 && $encryption === 'tls'))) {
        return null;
    }
    return compact('from', 'username', 'password', 'host', 'port', 'encryption');
}

function signup_code_mailer(string $email, string $code, array $settings): PHPMailer {
    // Keep the existing app sending while this helper is deployed before the core.
    if (function_exists('signup_app')) $app = signup_app();
    elseif (!defined('DHEBE_TESTER_APP') || DHEBE_TESTER_APP === 'dhebevoice') $app = ['id' => 'dhebevoice', 'name' => 'DhebeVoice', 'path' => '/dhebevoice/'];
    else throw new RuntimeException('App mail support is not deployed.');
    $config = signup_smtp_config($settings);
    $recipient = signup_email($email);
    if (!$config || !$recipient || !preg_match('/^[0-9]{8}$/D', $code)) {
        throw new InvalidArgumentException('Invalid verification mail configuration.');
    }
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->Port = $config['port'];
    $mail->SMTPSecure = $config['encryption'];
    $mail->SMTPAuth = true;
    $mail->SMTPAutoTLS = false;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPDebug = 0;
    $mail->Timeout = 10;
    $mail->getSMTPInstance()->Timelimit = 15;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]];
    $mail->Hostname = 'www.dhebe.com';
    $mail->Helo = 'www.dhebe.com';
    $mail->XMailer = ' ';
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
    $mail->setFrom($config['from'], $app['name']);
    // The authenticated mailbox must own both the visible and envelope sender.
    $mail->Sender = $config['from'];
    $mail->addReplyTo('support@dhebe.com', $app['name'] . ' support');
    $mail->addAddress($recipient);
    $mail->Subject = 'Verify your ' . $app['name'] . ' tester email';
    $mail->Body = 'Your ' . $app['name'] . " verification code is: $code\r\n\r\n"
        . 'Enter it on https://www.dhebe.com' . $app['path'] . " within 10 minutes.\r\n"
        . "Do not share this code. This confirms your email, not app access.\r\n\r\n"
        . "If you did not request this, ignore this email. You will not be added.\r\n"
        . "Questions or removal requests: support@dhebe.com\r\n";
    return $mail;
}

function signup_deliver_mail(PHPMailer $mail): bool {
    try {
        return $mail->send();
    } catch (Throwable $exception) {
        // Never expose SMTP replies, addresses, codes, or authentication details.
        return false;
    } finally {
        $mail->smtpClose();
    }
}
