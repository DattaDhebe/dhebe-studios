<?php
declare(strict_types=1);

function signup_app(): array {
    $id = defined('DHEBE_TESTER_APP') ? DHEBE_TESTER_APP : 'dhebevoice';
    $names = ['dhebevoice' => 'DhebeVoice', 'rivetprep' => 'RivetPrep', 'rostercairn' => 'RosterCairn'];
    if (!is_string($id) || !isset($names[$id])) throw new RuntimeException('Unsupported tester app.');
    return ['id' => $id, 'name' => $names[$id], 'path' => $id === 'dhebevoice' ? '/dhebevoice/' : '/apps/' . $id . '/', 'consent' => $id . '-testers-2026-10-22'];
}

define('DHEBE_CONSENT', signup_app()['consent']);

require_once __DIR__ . '/dhebevoice-smtp.php';

function signup_directory(): string {
    $voice = getenv('DHEBE_SIGNUP_DIRECTORY') ?: dirname(__DIR__, 2) . '/private/dhebevoice-signups';
    return signup_app()['id'] === 'dhebevoice' ? $voice : dirname($voice) . '/' . signup_app()['id'] . '-signups';
}

function signup_mail_directory(): string {
    return getenv('DHEBE_SIGNUP_MAIL_DIRECTORY') ?: (getenv('DHEBE_SIGNUP_DIRECTORY') ?: dirname(__DIR__, 2) . '/private/dhebevoice-signups');
}

function signup_database(string $directory): PDO {
    umask(0077);
    if (is_link($directory) || (!is_dir($directory) && !mkdir($directory, 0700, true))) {
        throw new RuntimeException('Private storage unavailable.');
    }
    $real = realpath($directory);
    $web = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
    if ($real === false || ($web && ($real === $web || str_starts_with($real, $web . DIRECTORY_SEPARATOR)))) {
        throw new RuntimeException('Storage must be outside the document root.');
    }
    $path = $real . '/testers.sqlite3';
    if (is_link($path)) throw new RuntimeException('Linked database refused.');
    chmod($real, 0700);
    $db = new PDO('sqlite:' . $path, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    chmod($path, 0600);
    $db->exec('PRAGMA busy_timeout=5000');
    $db->exec('CREATE TABLE IF NOT EXISTS signups (email TEXT PRIMARY KEY, created_at TEXT NOT NULL, consent_version TEXT NOT NULL)');
    $db->exec('CREATE TABLE IF NOT EXISTS request_buckets (minute INTEGER PRIMARY KEY, requests INTEGER NOT NULL)');
    $db->exec('CREATE TABLE IF NOT EXISTS email_verifications (email TEXT PRIMARY KEY, verified_at TEXT NOT NULL, consent_version TEXT NOT NULL)');
    $db->exec('CREATE TABLE IF NOT EXISTS pending_verifications (email TEXT PRIMARY KEY, challenge TEXT UNIQUE NOT NULL, code_hash TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL, consent_version TEXT NOT NULL, public_opt_in INTEGER NOT NULL DEFAULT 0, display_name TEXT NOT NULL DEFAULT \'\', public_email INTEGER NOT NULL DEFAULT 0)');
    $db->exec('CREATE TABLE IF NOT EXISTS public_testers (email TEXT PRIMARY KEY, public_id TEXT UNIQUE NOT NULL, opted_in_at TEXT NOT NULL, display_name TEXT NOT NULL DEFAULT \'\', public_email INTEGER NOT NULL DEFAULT 0)');
    $db->exec('CREATE TABLE IF NOT EXISTS verification_limits (bucket TEXT PRIMARY KEY, window INTEGER NOT NULL, requests INTEGER NOT NULL)');
    return $db;
}

function signup_prune(PDO $db, int $now): void {
    $statement = $db->prepare('DELETE FROM signups WHERE created_at < ?');
    $statement->execute([gmdate('Y-m-d\TH:i:s', $now - 180 * 86400)]);
    $statement = $db->prepare('DELETE FROM request_buckets WHERE minute < ?');
    $statement->execute([intdiv($now, 60) - 1]);
    $db->exec('DELETE FROM email_verifications WHERE email NOT IN (SELECT email FROM signups)');
    $db->exec('DELETE FROM public_testers WHERE email NOT IN (SELECT email FROM signups)');
    $statement = $db->prepare('DELETE FROM pending_verifications WHERE expires_at <= ?');
    $statement->execute([$now]);
    $statement = $db->prepare('DELETE FROM verification_limits WHERE window < ?');
    $statement->execute([$now - 3600]);
}

function signup_settings(string $directory): array {
    // Apps share the existing private sender credentials, never signup records.
    if (signup_app()['id'] !== 'dhebevoice' && !file_exists($directory . '/settings.php')) $directory = signup_mail_directory();
    $path = $directory . '/settings.php';
    $settings = [];
    if (is_file($path) && !is_link($path)) {
        $web = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
        $real = realpath($directory);
        if (!$real || ($web && ($real === $web || str_starts_with($real, $web . DIRECTORY_SEPARATOR)))) {
            throw new RuntimeException('Settings must be private.');
        }
        $settings = require $path;
        if (!is_array($settings)) throw new RuntimeException('Invalid private settings.');
    }
    return $settings + [
        'mail_from' => getenv('DHEBE_SIGNUP_MAIL_FROM') ?: '',
        'smtp_username' => getenv('DHEBE_SIGNUP_SMTP_USERNAME') ?: '',
        'smtp_password' => getenv('DHEBE_SIGNUP_SMTP_PASSWORD') ?: '',
    ];
}

function signup_limit(PDO $db, string $bucket, int $window, int $maximum): bool {
    $statement = $db->prepare('INSERT INTO verification_limits VALUES (?, ?, 1) ON CONFLICT(bucket) DO UPDATE SET requests=CASE WHEN window=excluded.window THEN requests+1 ELSE 1 END, window=excluded.window');
    $statement->execute([$bucket, $window]);
    $statement = $db->prepare('SELECT requests FROM verification_limits WHERE bucket=?');
    $statement->execute([$bucket]);
    return (int)$statement->fetchColumn() <= $maximum;
}

function signup_domain(string $domain): ?bool {
    $records = @dns_get_record($domain, DNS_MX);
    if ($records === false) return null;
    if ($records) {
        foreach ($records as $record) {
            if (!empty($record['target']) && $record['target'] !== '.') return true;
        }
        return false; // A null MX explicitly refuses mail, even if the domain has an A record.
    }
    return checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA');
}

function signup_send_code(string $email, string $code, array $settings): bool {
    if (!signup_smtp_config($settings)) return false;
    try {
        if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
            $autoload = signup_mail_directory() . '/vendor/autoload.php';
            if (!is_file($autoload) || is_link($autoload)) return false;
            require_once $autoload;
        }
        return signup_deliver_mail(signup_code_mailer($email, $code, $settings));
    } catch (Throwable $exception) {
        return false;
    }
}

function signup_verify(PDO $db, array $data, int $now): array {
    if (array_diff(array_keys($data), ['action', 'request_id', 'code'])
        || !is_string($data['request_id'] ?? null) || !preg_match('/^[a-f0-9]{64}$/D', $data['request_id'])
        || !is_string($data['code'] ?? null) || !preg_match('/^[0-9]{8}$/D', $data['code'])) {
        return [400, ['detail' => 'Enter the 8-digit code from your verification email.']];
    }
    $statement = $db->prepare('SELECT * FROM pending_verifications WHERE challenge=?');
    $statement->execute([hash('sha256', $data['request_id'])]);
    $pending = $statement->fetch(PDO::FETCH_ASSOC);
    if (!$pending || (int)$pending['expires_at'] <= $now || (int)$pending['attempts'] >= 5) {
        return [400, ['detail' => 'This code has expired or is no longer available. Request a new code.']];
    }
    $statement = $db->prepare('UPDATE pending_verifications SET attempts=attempts+1 WHERE email=?');
    $statement->execute([$pending['email']]);
    if (!password_verify($data['code'], $pending['code_hash'])) {
        return [400, ['detail' => 'The code is incorrect. Check your email and try again.']];
    }
    $created = gmdate('Y-m-d\TH:i:s', $now) . '+00:00';
    $statement = $db->prepare('INSERT INTO signups VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING');
    $statement->execute([$pending['email'], $created, $pending['consent_version']]);
    if ((int)$pending['public_opt_in'] === 1) {
        $statement = $db->prepare('INSERT INTO public_testers VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET opted_in_at=excluded.opted_in_at, display_name=excluded.display_name, public_email=excluded.public_email');
        $statement->execute([$pending['email'], bin2hex(random_bytes(16)), $created, $pending['display_name'], $pending['public_email']]);
    } else {
        $statement = $db->prepare('DELETE FROM public_testers WHERE email=?');
        $statement->execute([$pending['email']]);
    }
    $statement = $db->prepare('INSERT INTO email_verifications VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET verified_at=excluded.verified_at, consent_version=excluded.consent_version');
    $statement->execute([$pending['email'], $created, $pending['consent_version']]);
    $statement = $db->prepare('DELETE FROM pending_verifications WHERE email=?');
    $statement->execute([$pending['email']]);
    return [200, ['request_received' => true, 'verified' => true]];
}

function signup_email(mixed $email): ?string {
    if (!is_string($email) || strlen($email) > 300) return null;
    $email = trim($email);
    if (substr_count($email, '@') !== 1) return null;
    [$local, $domain] = explode('@', $email);
    if (function_exists('idn_to_ascii')) {
        $domain = idn_to_ascii($domain, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
        if ($domain === false) return null;
    }
    if (strlen($local) < 1 || strlen($local) > 64 || strlen($local . '@' . $domain) > 254
        || !preg_match("~^[A-Za-z0-9!#$%&'*+/=?^_`{|}\\x7e-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}\\x7e-]+)*$~D", $local)) return null;
    $labels = explode('.', $domain);
    if (count($labels) < 2) return null;
    foreach ($labels as $label) {
        if (!preg_match('/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/D', $label)) return null;
    }
    return strtolower($local . '@' . $domain);
}

function signup_request(array $server, string $raw, string $directory, int $now, array $services = []): array {
    $error = static fn(int $code, string $message): array => [$code, ['detail' => $message]];
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') return $error(405, 'POST required.');
    if (!in_array($server['HTTP_ORIGIN'] ?? '', ['https://www.dhebe.com', 'https://dhebe.com'], true)) {
        return $error(403, 'Submit this request from the DhebeVoice page.');
    }
    if (strtolower(trim(explode(';', $server['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') return $error(415, 'Use a JSON signup request.');
    if (strlen($raw) > 1024 || (int)($server['CONTENT_LENGTH'] ?? 0) > 1024) return $error(413, 'The signup request is too large.');
    try {
        $data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        return $error(400, 'The signup request could not be read.');
    }
    if (!is_array($data)) return $error(400, 'The signup request could not be read.');
    $verifying = ($data['action'] ?? '') === 'verify';
    $email = null;
    if (!$verifying) {
        if (($data['consent'] ?? null) !== true) return $error(400, 'Please agree to receive ' . signup_app()['name'] . ' testing invitations.');
        if (!empty($data['website']) || array_diff(array_keys($data), ['email', 'consent', 'website', 'public_opt_in', 'display_name', 'public_email'])
            || (array_key_exists('public_opt_in', $data) && !is_bool($data['public_opt_in']))
            || (array_key_exists('public_email', $data) && !is_bool($data['public_email']))
            || !is_string($data['display_name'] ?? '') || strlen($data['display_name'] ?? '') > 240) return $error(400, 'This signup request could not be accepted.');
        $name = trim($data['display_name'] ?? '');
        if ($name !== '' && (!preg_match('/^.{1,60}$/usD', $name) || preg_match('/[\p{C}<>]/u', $name))) return $error(400, 'Use a name of up to 60 characters, without markup or control characters.');
        if (!($data['public_opt_in'] ?? false) && (($data['public_email'] ?? false) || $name !== '')) return $error(400, 'Choose the optional public list before publishing a name or full email.');
        $email = signup_email($data['email'] ?? null);
        if ($email === null) return $error(400, 'Enter a valid email address.');
    }
    $db = null;
    try {
        $db = signup_database($directory);
        $db->exec('BEGIN IMMEDIATE');
        signup_prune($db, $now);
        $minute = intdiv($now, 60);
        $rate = $db->prepare('INSERT INTO request_buckets VALUES (?, 1) ON CONFLICT(minute) DO UPDATE SET requests=requests+1');
        $rate->execute([$minute]);
        $rate = $db->prepare('SELECT requests FROM request_buckets WHERE minute=?');
        $rate->execute([$minute]);
        if ((int)$rate->fetchColumn() > 30) {
            $db->exec('COMMIT');
            return $error(429, 'Too many signup requests. Please try again in a minute.');
        }
        if ($verifying) {
            $result = signup_verify($db, $data, $now);
            $db->exec('COMMIT');
            return $result;
        }
        $allowed = signup_limit($db, 'email:' . hash('sha256', $email), intdiv($now, 3600) * 3600, 5);
        $allowed = signup_limit($db, 'mail-hour', intdiv($now, 3600) * 3600, 100) && $allowed;
        $db->exec('COMMIT');
        if (!$allowed) return $error(429, 'Too many code requests. Please try again later.');
        $settings = $services['settings'] ?? signup_settings($directory);
        if (!isset($services['send']) && !signup_smtp_config($settings)) return $error(503, 'Email verification is not configured yet. Please contact support@dhebe.com.');
        $domain = ($services['domain'] ?? 'signup_domain')(explode('@', $email)[1]);
        if ($domain === null) return $error(503, 'We could not check your email domain. Please try again.');
        if (!$domain) return $error(400, 'This email domain cannot receive mail. Check the address.');
        $db->exec('BEGIN IMMEDIATE');
        $statement = $db->prepare('SELECT created_at FROM pending_verifications WHERE email=?');
        $statement->execute([$email]);
        $last = $statement->fetchColumn();
        if ($last !== false && $now - (int)$last < 60) {
            $db->exec('COMMIT');
            return $error(429, 'Wait one minute before requesting another code.');
        }
        if ((int)$db->query('SELECT count(*) FROM (SELECT email FROM signups UNION SELECT email FROM pending_verifications)')->fetchColumn() >= 10000) {
            $statement = $db->prepare('SELECT email FROM signups WHERE email=? UNION SELECT email FROM pending_verifications WHERE email=?');
            $statement->execute([$email, $email]);
            if (!$statement->fetchColumn()) {
                $db->exec('COMMIT');
                return $error(503, 'The tester list is temporarily full. Please email support@dhebe.com.');
            }
        }
        $requestId = bin2hex(random_bytes(32));
        $code = str_pad((string)random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
        $statement = $db->prepare('INSERT INTO pending_verifications VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET challenge=excluded.challenge, code_hash=excluded.code_hash, created_at=excluded.created_at, expires_at=excluded.expires_at, attempts=0, consent_version=excluded.consent_version, public_opt_in=excluded.public_opt_in, display_name=excluded.display_name, public_email=excluded.public_email');
        $statement->execute([$email, hash('sha256', $requestId), password_hash($code, PASSWORD_DEFAULT), $now, $now + 600, DHEBE_CONSENT, ($data['public_opt_in'] ?? false) ? 1 : 0, $name, ($data['public_email'] ?? false) ? 1 : 0]);
        $db->exec('COMMIT');
        if (!(($services['send'] ?? 'signup_send_code')($email, $code, $settings))) {
            $statement = $db->prepare('DELETE FROM pending_verifications WHERE challenge=?');
            $statement->execute([hash('sha256', $requestId)]);
            return $error(503, 'The verification email could not be queued. Please try again or contact support@dhebe.com.');
        }
        return [200, ['request_received' => true, 'verification_required' => true, 'request_id' => $requestId, 'expires_in' => 600, 'resend_after' => 60]];
    } catch (Throwable $exception) {
        if ($db) {
            try { $db->exec('ROLLBACK'); } catch (Throwable $ignored) { /* No open transaction. */ }
        }
        return $error(503, 'Signup is temporarily unavailable. Please try again or email support@dhebe.com.');
    }
}

if (!defined('DHEBE_SIGNUP_LIBRARY')) {
    ini_set('display_errors', '0');
    ini_set('log_errors', '0');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    header('Referrer-Policy: no-referrer');
    [$status, $body] = signup_request($_SERVER, file_get_contents('php://input', false, null, 0, 1025) ?: '', signup_directory(), time());
    if ($status === 405) header('Allow: POST');
    if ($status === 429) header('Retry-After: 60');
    http_response_code($status);
    echo json_encode($body);
}
