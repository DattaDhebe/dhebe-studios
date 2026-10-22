<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (isset($argv[3])) throw new RuntimeException('Too many maintenance arguments.');
if (isset($argv[2]) && str_starts_with($argv[2], '--app=')) {
    $app = substr($argv[2], 6);
    if (!in_array($app, ['dhebevoice', 'rivetprep', 'rostercairn'], true)) throw new RuntimeException('Unsupported tester app.');
    define('DHEBE_TESTER_APP', $app);
}
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/dhebevoice-signup.php';
$mode = $argv[1] ?? '--summary';
if ($mode === '--prune' && !isset($argv[2])) {
    $voice = signup_directory();
    $counts = [];
    foreach (['dhebevoice', 'rivetprep', 'rostercairn'] as $id) {
        $directory = $id === 'dhebevoice' ? $voice : dirname($voice) . '/' . $id . '-signups';
        if (!is_file($directory . '/testers.sqlite3')) continue;
        $db = signup_database($directory);
        signup_prune($db, time());
        $counts[$id] = (int)$db->query('SELECT count(*) FROM signups')->fetchColumn();
    }
    echo json_encode(['ok' => true, 'apps' => $counts, 'retention_days' => 180]) . PHP_EOL;
    exit;
}
if (in_array($mode, ['--summary', '--prune'], true) && isset($argv[2]) && !str_starts_with($argv[2], '--app=')) throw new RuntimeException('Unsupported app argument.');
$db = signup_database(signup_directory());
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
echo json_encode(['ok' => true, 'app' => signup_app()['id'], 'entries' => (int)$db->query('SELECT count(*) FROM signups')->fetchColumn(), 'retention_days' => 180]) . PHP_EOL;
