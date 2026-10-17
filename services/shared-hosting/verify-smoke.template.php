<?php
declare(strict_types=1);
// Temporary, signed deployment verification. Never upload unchanged.
ini_set('display_errors', '0'); ini_set('log_errors', '0');
header('Content-Type: application/json'); header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || time() > (int)'__SETUP_EXPIRES__'
    || !hash_equals('__SETUP_TOKEN_SHA256__', hash('sha256', $_SERVER['HTTP_X_SETUP_TOKEN'] ?? ''))) { http_response_code(404); exit('{}'); }
try {
    $data = json_decode(file_get_contents('php://input', false, null, 0, 512), true, 4, JSON_THROW_ON_ERROR);
    $email = $data['email'] ?? '';
    if (!is_string($email) || !preg_match('/^dv-smoke-[a-z0-9-]+@example\.com$/D', $email)) throw new RuntimeException('Reserved smoke email required.');
    $directory = dirname(__DIR__, 2) . '/private/dhebevoice-signups';
    $file = $directory . '/testers.sqlite3';
    if (!is_file($file) || is_link($file) || is_link($directory) || (fileperms($file) & 0777) !== 0600 || (fileperms($directory) & 0777) !== 0700) throw new RuntimeException('Private storage verification failed.');
    $db = new PDO('sqlite:' . $file, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA busy_timeout=5000');
    $check = $db->prepare('SELECT consent_version FROM signups WHERE email=?'); $check->execute([$email]);
    if ($check->fetchColumn() !== 'dhebevoice-testers-2026-10-17') throw new RuntimeException('Smoke consent missing.');
    $delete = $db->prepare('DELETE FROM signups WHERE email=?'); $delete->execute([$email]);
    if ($delete->rowCount() !== 1 || !unlink(__FILE__)) throw new RuntimeException('Smoke cleanup failed.');
    echo '{"saved_with_consent":true,"private_permissions":true,"synthetic_row_deleted":true,"probe_removed":true}';
} catch (Throwable $exception) { http_response_code(503); echo '{"error":"Signup verification failed."}'; }
