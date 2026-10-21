<?php
declare(strict_types=1);
if (!defined('DHEBE_SIGNUP_LIBRARY')) {
    define('DHEBE_TESTERS_ENDPOINT', true);
    define('DHEBE_SIGNUP_LIBRARY', true);
    require __DIR__ . '/dhebevoice-signup.php';
}

function testers_mask(string $email): string {
    [$local, $domain] = explode('@', $email);
    $labels = explode('.', $domain);
    return $local[0] . '***@' . $domain[0] . '***.' . end($labels);
}

function testers_request(array $server, array $query, string $directory, int $now): array {
    if (($server['REQUEST_METHOD'] ?? '') !== 'GET') return [405, ['detail' => 'GET required.']];
    if (array_diff(array_keys($query), ['page'])
        || !is_string($query['page'] ?? '0') || !preg_match('/^(?:0|[1-9][0-9]{0,2})$/D', $query['page'] ?? '0')) {
        return [400, ['detail' => 'Invalid tester-list page.']];
    }
    try {
        $db = signup_database($directory);
        $db->exec('BEGIN IMMEDIATE');
        signup_prune($db, $now);
        $source = ' FROM public_testers p JOIN signups s ON s.email=p.email JOIN email_verifications v ON v.email=p.email';
        $total = (int)$db->query('SELECT count(*)' . $source)->fetchColumn();
        $page = min((int)($query['page'] ?? '0'), max(0, (int)ceil($total / 24) - 1));
        $statement = $db->prepare('SELECT p.public_id, p.email, p.opted_in_at, p.display_name, p.public_email' . $source . ' ORDER BY p.opted_in_at DESC, p.public_id LIMIT 24 OFFSET ?');
        $statement->bindValue(1, $page * 24, PDO::PARAM_INT);
        $statement->execute();
        $testers = [];
        foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $testers[] = ['id' => $row['public_id'], 'email_label' => (int)$row['public_email'] === 1 ? $row['email'] : testers_mask($row['email']), 'email_visibility' => (int)$row['public_email'] === 1 ? 'full' : 'masked', 'display_name' => $row['display_name'], 'joined_on' => substr($row['opted_in_at'], 0, 10)];
        }
        $db->exec('COMMIT');
        return [200, ['testers' => $testers, 'total' => $total, 'page' => $page, 'page_size' => 24]];
    } catch (Throwable $exception) {
        if (isset($db)) { try { $db->exec('ROLLBACK'); } catch (Throwable $ignored) { /* No open transaction. */ } }
        return [503, ['detail' => 'The public tester list is temporarily unavailable.']];
    }
}

if (defined('DHEBE_TESTERS_ENDPOINT')) {
    ini_set('display_errors', '0');
    ini_set('log_errors', '0');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    [$status, $body] = testers_request($_SERVER, $_GET, signup_directory(), time());
    if ($status === 405) header('Allow: GET');
    http_response_code($status);
    echo json_encode($body);
}
