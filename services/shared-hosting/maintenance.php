<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/dhebevoice-signup.php';
$db = signup_database(signup_directory());
$mode = $argv[1] ?? '--summary';
if ($mode === '--prune') {
    signup_prune($db, time());
} elseif ($mode === '--verify-smoke' || $mode === '--delete-smoke') {
    $email = $argv[2] ?? '';
    if (!preg_match('/^dv-smoke-[a-z0-9-]+@example\.com$/D', $email)) throw new RuntimeException('Reserved smoke address required.');
    $check = $db->prepare('SELECT consent_version FROM signups WHERE email=?');
    $check->execute([$email]);
    if ($check->fetchColumn() !== DHEBE_CONSENT) throw new RuntimeException('Smoke consent not found.');
    if ($mode === '--delete-smoke') {
        $delete = $db->prepare('DELETE FROM signups WHERE email=?');
        $delete->execute([$email]);
    }
} elseif ($mode !== '--summary') {
    throw new RuntimeException('Unsupported maintenance action.');
}
echo json_encode(['ok' => true, 'entries' => (int)$db->query('SELECT count(*) FROM signups')->fetchColumn(), 'retention_days' => 180]) . PHP_EOL;
