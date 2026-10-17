<?php
declare(strict_types=1);
// One-time, short-lived transfer of existing consent records. No read/export API.
ini_set('display_errors', '0'); ini_set('log_errors', '0');
header('Content-Type: application/json'); header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || time() > (int)'__SETUP_EXPIRES__'
    || !hash_equals('__SETUP_TOKEN_SHA256__', hash('sha256', $_SERVER['HTTP_X_SETUP_TOKEN'] ?? ''))) { http_response_code(404); exit('{}'); }
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/dhebevoice-signup.php';
try {
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if (strlen($raw) > 65536) throw new RuntimeException('Migration too large.');
    $entries = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
    if (!is_array($entries) || !array_is_list($entries) || count($entries) > 100) throw new RuntimeException('Invalid migration.');
    foreach ($entries as $entry) {
        if (!is_array($entry) || count($entry) !== 3 || signup_email($entry[0]) !== $entry[0]
            || !is_string($entry[1]) || !preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+\+00:00$/D', $entry[1])
            || strtotime($entry[1]) === false || strtotime($entry[1]) > time() + 60 || $entry[2] !== DHEBE_CONSENT) throw new RuntimeException('Invalid consent record.');
    }
    $db = signup_database(signup_directory()); $db->exec('BEGIN IMMEDIATE');
    $insert = $db->prepare('INSERT INTO signups VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET created_at=min(signups.created_at, excluded.created_at)');
    foreach ($entries as $entry) $insert->execute($entry);
    signup_prune($db, time());
    if ((int)$db->query('SELECT count(*) FROM signups')->fetchColumn() > 10000) throw new RuntimeException('Tester capacity exceeded.');
    $db->exec('COMMIT');
    if (!unlink(__FILE__)) throw new RuntimeException('Migration cleanup failed.');
    echo json_encode(['consent_records_reconciled' => count($entries), 'original_timestamps_preserved' => true, 'migration_removed' => true]);
} catch (Throwable $exception) { http_response_code(503); echo '{"error":"Private migration failed."}'; }
