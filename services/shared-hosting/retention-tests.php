<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$retentionRoot = sys_get_temp_dir() . '/dhebe-retention-' . bin2hex(random_bytes(8));
$retentionPrevious = getenv('DHEBE_SIGNUP_DIRECTORY');
$retentionChecks = 0;
try {
    foreach (['dhebevoice', 'rivetprep', 'rostercairn'] as $id) {
        $store = signup_database($retentionRoot . '/' . $id . '-signups');
        $insert = $store->prepare('INSERT INTO signups VALUES (?, ?, ?)');
        $insert->execute(['expired@example.com', gmdate('Y-m-d\TH:i:s', time() - 181 * 86400), $id . '-testers-2026-10-22']);
        $insert->execute(['current@example.com', gmdate('Y-m-d\TH:i:s'), $id . '-testers-2026-10-22']);
        $insert = $store = null;
    }
    mkdir($retentionRoot . '/api', 0700);
    $fixtures = ['signup.php' => 'dhebevoice-signup.php', 'dhebevoice-smtp.php' => 'dhebevoice-smtp.php', 'maintenance.php' => 'dhebevoice-maintenance.php'];
    foreach ($fixtures as $source => $destination) {
        if (!copy(__DIR__ . '/' . $source, $retentionRoot . '/api/' . $destination)) throw new RuntimeException('Cannot prepare maintenance fixture.');
    }
    putenv('DHEBE_SIGNUP_DIRECTORY=' . $retentionRoot . '/dhebevoice-signups');
    $process = proc_open([PHP_BINARY, $retentionRoot . '/api/dhebevoice-maintenance.php', '--prune'], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    if (!is_resource($process)) throw new RuntimeException('Cannot run maintenance test.');
    $output = stream_get_contents($pipes[1]); fclose($pipes[1]);
    $errors = stream_get_contents($pipes[2]); fclose($pipes[2]);
    if (proc_close($process) !== 0 || $errors !== '') throw new RuntimeException('Maintenance test failed.');
    $report = json_decode($output, true, 8, JSON_THROW_ON_ERROR);
    foreach (['dhebevoice', 'rivetprep', 'rostercairn'] as $id) {
        $retentionChecks++;
        if (($report['apps'][$id] ?? null) !== 1) throw new RuntimeException('Daily pruning did not include every app.');
        $store = signup_database($retentionRoot . '/' . $id . '-signups');
        $retentionChecks++;
        if ($store->query('SELECT email FROM signups')->fetchColumn() !== 'current@example.com') throw new RuntimeException('Pruning changed an unexpired signup.');
        $store = null;
    }
} finally {
    putenv($retentionPrevious === false ? 'DHEBE_SIGNUP_DIRECTORY' : 'DHEBE_SIGNUP_DIRECTORY=' . $retentionPrevious);
    foreach (['dhebevoice-signup.php', 'dhebevoice-smtp.php', 'dhebevoice-maintenance.php'] as $file) {
        if (is_file($retentionRoot . '/api/' . $file)) unlink($retentionRoot . '/api/' . $file);
    }
    if (is_dir($retentionRoot . '/api')) rmdir($retentionRoot . '/api');
    foreach (['dhebevoice', 'rivetprep', 'rostercairn'] as $id) {
        $directory = $retentionRoot . '/' . $id . '-signups';
        if (is_file($directory . '/testers.sqlite3')) unlink($directory . '/testers.sqlite3');
        if (is_dir($directory)) rmdir($directory);
    }
    if (is_dir($retentionRoot)) rmdir($retentionRoot);
}
echo json_encode(['retention_checks_passed' => $retentionChecks]) . PHP_EOL;
