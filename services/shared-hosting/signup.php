<?php
declare(strict_types=1);

const DHEBE_CONSENT = 'dhebevoice-testers-2026-10-17';

function signup_directory(): string {
    return getenv('DHEBE_SIGNUP_DIRECTORY') ?: dirname(__DIR__, 2) . '/private/dhebevoice-signups';
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
    return $db;
}

function signup_prune(PDO $db, int $now): void {
    $statement = $db->prepare('DELETE FROM signups WHERE created_at < ?');
    $statement->execute([gmdate('Y-m-d\TH:i:s', $now - 180 * 86400)]);
    $statement = $db->prepare('DELETE FROM request_buckets WHERE minute < ?');
    $statement->execute([intdiv($now, 60) - 1]);
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

function signup_request(array $server, string $raw, string $directory, int $now): array {
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
    if (!is_array($data) || ($data['consent'] ?? null) !== true) return $error(400, 'Please agree to receive DhebeVoice testing invitations.');
    if (!empty($data['website']) || array_diff(array_keys($data), ['email', 'consent', 'website'])) return $error(400, 'This signup request could not be accepted.');
    $email = signup_email($data['email'] ?? null);
    if ($email === null) return $error(400, 'Enter a valid email address.');
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
        $exists = $db->prepare('SELECT 1 FROM signups WHERE email=?');
        $exists->execute([$email]);
        if (!$exists->fetchColumn()) {
            if ((int)$db->query('SELECT count(*) FROM signups')->fetchColumn() >= 10000) {
                $db->exec('COMMIT');
                return $error(503, 'The tester list is temporarily full. Please email support@dhebe.com.');
            }
            $save = $db->prepare('INSERT INTO signups VALUES (?, ?, ?)');
            $save->execute([$email, gmdate('Y-m-d\TH:i:s', $now) . '+00:00', DHEBE_CONSENT]);
        }
        $db->exec('COMMIT');
        return [200, ['request_received' => true]];
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
