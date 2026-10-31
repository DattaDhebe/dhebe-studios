declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0'); ini_set('log_errors', '0'); umask(0077);
$spec = json_decode(base64_decode('eyJpZCI6ImNvZGVtZS1jb3B5LTIwMjYxMDMxLTAxIiwiYXJjaGl2ZUNvbW1pdCI6IjcyNjc0YzU5MjFlMzcxZjdlZWYyZWVjNzU2ZmJjNzBhMjljZjJlOWMiLCJhcmNoaXZlQnl0ZXMiOjEyMzg1MywiYXJjaGl2ZVNoYTI1NiI6IjQwOGU0YmY5YzJiOThiMzRjMmNmNzU5NDQzMGJiOTdiYjY3MGJlZTQ2MzNmZDAwNDZmOGM4NTBiNGQzOTJiYzkiLCJmaWxlcyI6W3sicGF0aCI6ImluZGV4Lmh0bWwiLCJieXRlcyI6MjYyNzgxLCJzaGEyNTYiOiIxNmQ5ZmYwNWQzOTU1ZWRkMTZhMjkyMGI1ZDE4NTNkZDI2NWI2NDZkZTY0ODUyN2YzZTZiNDUzMjhiOTYzMmY4IiwiZXhwZWN0ZWRCZWZvcmUiOiI4OTUxMTRlNDMwMzFmZmRhNWY4NWFiOWQwMGQzOTZlNTViMjAyOGUxZGMzMzJkY2JjZGFkMzI1M2I5OGFhMTA4Iiwic3RhZ2UiOjR9LHsicGF0aCI6ImluZGV4LnR4dCIsImJ5dGVzIjoxMjg0NzcsInNoYTI1NiI6IjNkNmQzMWZjYTM2OTU5MDk4YzZmMWEwYTQ4MjMyZDhiMjU5ZTE4YzZhNDE2NjAyZDUxMTY2Y2Y2MzBjYmNjMTMiLCJleHBlY3RlZEJlZm9yZSI6ImEyNzAxMWE2YjZkNzE0YzBkYjk5Y2M2MDlkMDBmY2IxYTA2YWIwMDkwN2Y1YjZmMWIxYjBkYWJkZjFmNDVmYmEiLCJzdGFnZSI6Mn0seyJwYXRoIjoiX19uZXh0Ll9fUEFHRV9fLnR4dCIsImJ5dGVzIjoxMjA4NjQsInNoYTI1NiI6ImJhOGI3ZDg5MjgxMDc2NDMyOGMxYzAxOTU3Y2FmMWYwZDlmYjdjMjYyMzM5ZmVkMDkzZTcxZjY1MTZjMTI3ZDMiLCJleHBlY3RlZEJlZm9yZSI6ImJkZjM3YjFiMTQ4OWFiZmU0NmZmN2JhMGE1MjkyODk3NTllNjM1ZjNlYmEwYjRjNDBjNTEzOTg2MzYxYmQ5M2YiLCJzdGFnZSI6Mn0seyJwYXRoIjoiX19uZXh0Ll9mdWxsLnR4dCIsImJ5dGVzIjoxMjg0NzcsInNoYTI1NiI6IjNkNmQzMWZjYTM2OTU5MDk4YzZmMWEwYTQ4MjMyZDhiMjU5ZTE4YzZhNDE2NjAyZDUxMTY2Y2Y2MzBjYmNjMTMiLCJleHBlY3RlZEJlZm9yZSI6ImEyNzAxMWE2YjZkNzE0YzBkYjk5Y2M2MDlkMDBmY2IxYTA2YWIwMDkwN2Y1YjZmMWIxYjBkYWJkZjFmNDVmYmEiLCJzdGFnZSI6Mn0seyJwYXRoIjoiX19uZXh0Ll9pbmRleC50eHQiLCJieXRlcyI6ODYyOSwic2hhMjU2IjoiYTJjMDM5MGZkNWQ4N2QxZWIyMTM5MDA4ZWIzM2VjNmQ0ZjU5MGJlMTQxOWE5NzkyOTBkNzk0NTQyODRjODI2OSIsImV4cGVjdGVkQmVmb3JlIjoiYTJjMDM5MGZkNWQ4N2QxZWIyMTM5MDA4ZWIzM2VjNmQ0ZjU5MGJlMTQxOWE5NzkyOTBkNzk0NTQyODRjODI2OSIsInN0YWdlIjoyfSx7InBhdGgiOiJfX25leHQuX3RyZWUudHh0IiwiYnl0ZXMiOjQwMiwic2hhMjU2IjoiNWVmYjQ5OGM0YTZhMDgwN2Y5ZmY5YjFkNmQ4MTEzZTUxNWMyMTU5MjU0NWNmZGFlMTE4NTA1NzlmNTdhNDlmYSIsImV4cGVjdGVkQmVmb3JlIjoiNWVmYjQ5OGM0YTZhMDgwN2Y5ZmY5YjFkNmQ4MTEzZTUxNWMyMTU5MjU0NWNmZGFlMTE4NTA1NzlmNTdhNDlmYSIsInN0YWdlIjoyfSx7InBhdGgiOiJwcm9kdWN0cy9jb2RlbWUvaW5kZXguaHRtbCIsImJ5dGVzIjoxNTc2Nywic2hhMjU2IjoiMzFkYmE4OGM0ZWM4MjdhYmFlYjE2MGFjOTM4Y2I0NTRhOTg4NzM2YmYzMTExODZkYzI0OGYzNzE3MjUwNWZkZCIsImV4cGVjdGVkQmVmb3JlIjoiNGZiZWM0Mzg3NzM5ZTEzYWJhZjJhN2E2MzY4ZDc1NzYyM2UyMWFhOTkwMDFjMTRjOTNkNDY4NWYzZjEzNTY2ZCIsInN0YWdlIjoxfV19', true), true, 32, JSON_THROW_ON_ERROR);
$root = '/home/u942725982/domains/dhebe.com/public_html';
$work = dirname($root) . '/private/site-releases/codeme-copy-20261031-01';

function drDirectory(string $path, int $mode = 0700): void {
    if (is_link($path) || (file_exists($path) && !is_dir($path))) throw new RuntimeException('Unsafe directory.');
    $parent = dirname($path);
    if ($parent !== $path) drDirectory($parent, $mode);
    if (!is_dir($path) && (!mkdir($path, $mode) || !chmod($path, $mode))) throw new RuntimeException('Directory creation failed.');
}
function drHash(string $path): ?string {
    if (is_link($path)) throw new RuntimeException('Linked file refused.');
    if (!file_exists($path)) return null;
    if (!is_file($path)) throw new RuntimeException('Expected regular file.');
    $hash = hash_file('sha256', $path);
    if (!is_string($hash)) throw new RuntimeException('File hashing failed.');
    return $hash;
}
function drTarget(string $root, string $name): string {
    $cursor = $root;
    foreach (explode('/', $name) as $part) {
        if ($part === '' || $part === '.' || $part === '..') throw new RuntimeException('Unsafe path component.');
        $cursor .= '/' . $part;
        if (is_link($cursor)) throw new RuntimeException('Linked deployment path refused.');
    }
    $target = $root . '/' . $name;
    if (file_exists($target) && !is_file($target)) throw new RuntimeException('Invalid deployment target.');
    $cursor = dirname($target);
    while (strlen($cursor) > strlen($root)) {
        if (file_exists($cursor) && !is_dir($cursor)) throw new RuntimeException('Invalid target directory.');
        $cursor = dirname($cursor);
    }
    return $target;
}
function drAtomic(string $path, string $bytes, int $mode): void {
    if (is_link($path)) throw new RuntimeException('Linked write target refused.');
    $temporary = tempnam(dirname($path), '.dhebe-');
    if ($temporary === false) throw new RuntimeException('Temporary write failed.');
    try {
        if (file_put_contents($temporary, $bytes, LOCK_EX) !== strlen($bytes) || !chmod($temporary, $mode) || !rename($temporary, $path)) throw new RuntimeException('Atomic write failed.');
    } finally { if (is_file($temporary)) unlink($temporary); }
}
function drStage(string $name): int {
    if ($name === 'products/codeme/index.html') return 1;
    if ($name === 'index.html') return 4;
    return 2;
}
function drAllowed(string $name): bool {
    return in_array($name, ['products/codeme/index.html', 'index.html', 'index.txt', '__next.__PAGE__.txt', '__next._full.txt', '__next._index.txt', '__next._tree.txt'], true);
}
function drTree(string $root, string $relative, array $excluded = []): array {
    $base = $root . '/' . $relative;
    $cursor = $root;
    foreach (explode('/', $relative) as $part) { $cursor .= '/' . $part; if (is_link($cursor)) throw new RuntimeException('Linked protected directory refused.'); }
    if (!file_exists($base)) return [$relative . '/' => null];
    if (!is_dir($base)) throw new RuntimeException('Invalid protected directory.');
    $result = []; $count = 0;
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS));
    foreach ($iterator as $entry) {
        if (++$count > 2000 || $entry->isLink() || !$entry->isFile()) throw new RuntimeException('Unexpected protected tree entry.');
        $path = str_replace(DIRECTORY_SEPARATOR, '/', $entry->getPathname());
        $name = substr($path, strlen($root) + 1);
        if (!in_array($name, $excluded, true)) $result[$name] = drHash(drTarget($root, $name));
    }
    ksort($result); return $result;
}
function drProtected(string $root, array $manifest): array {
    $result = [];
    foreach (['.htaccess', 'sitemap.xml', 'api/careers-apply.php', 'api/careers-roles.json', 'api/dhebevoice-signup.php', 'api/dhebevoice-smtp.php', 'trade/index.php', 'ai_lead_agent/index.php'] as $path) $result[$path] = drHash(drTarget($root, $path));
    foreach (['careers', 'privacy', 'products/codeme'] as $tree) $result += drTree($root, $tree, ['products/codeme/index.html']);
    $domain = dirname($root);
    foreach (['careerlift-payments-private/config.php', 'codeme-payments-private/config.php', 'codeme-payments-private/bootstrap.php', 'codeme-payments-private/lib/Commerce.php', 'codeme-payments-private/check-install.php', 'codeme-payments-private/releases/codeme-0.7.0-local-c015749a7d93.zip', 'codeme-payments-private/releases/codeme-0.7.0-local-9587d0a573e2.zip'] as $path) $result['../' . $path] = drHash(drTarget($domain, $path));
    return $result;
}

$ownedLock = false; $written = []; $original = []; $metadata = []; $zip = null;
try {
    if (($spec['id'] ?? '') !== 'codeme-copy-20261031-01' || !preg_match('/^[a-f0-9]{40}$/D', $spec['archiveCommit'] ?? '')) throw new RuntimeException('Invalid release identity.');
    if (str_replace('\\', '/', (string)realpath($root)) !== $root || is_link($root)) throw new RuntimeException('Unexpected website root.');
    drDirectory($work);
    $lock = fopen($work . '/install.lock', 'c');
    if (!$lock) throw new RuntimeException('Release lock unavailable.');
    if (!flock($lock, LOCK_EX | LOCK_NB)) { echo "{\"deployed\":false,\"alreadyRunning\":true}\n"; exit; }
    $ownedLock = true;
    if (is_file($work . '/complete.json')) {
        $complete = json_decode(file_get_contents($work . '/complete.json'), true, 16, JSON_THROW_ON_ERROR);
        if (!is_array($complete) || ($complete['deployed'] ?? false) !== true || ($complete['release'] ?? '') !== $spec['id']) throw new RuntimeException('Invalid completion receipt.');
        echo json_encode($complete, JSON_THROW_ON_ERROR) . "\n"; exit;
    }
    if (is_file($work . '/failed.json')) throw new RuntimeException('Earlier deployment failure requires review.');
    if (!function_exists('curl_init') || !class_exists('ZipArchive')) throw new RuntimeException('Required deployment extensions missing.');
    if (!is_int($spec['archiveBytes'] ?? null) || $spec['archiveBytes'] < 22 || $spec['archiveBytes'] > 2000000 || !preg_match('/^[a-f0-9]{64}$/D', $spec['archiveSha256'] ?? '')) throw new RuntimeException('Invalid archive metadata.');
    if (!is_array($spec['files'] ?? null) || count($spec['files']) !== 7) throw new RuntimeException('Invalid manifest size.');
    $total = 0;
    foreach ($spec['files'] as $meta) {
        if (!is_array($meta) || !is_string($meta['path'] ?? null)) throw new RuntimeException('Invalid manifest entry.');
        $name = $meta['path'];
        if (!drAllowed($name) || isset($metadata[$name]) || !is_int($meta['bytes'] ?? null) || $meta['bytes'] < 1 || $meta['bytes'] > 1000000 || !preg_match('/^[a-f0-9]{64}$/D', $meta['sha256'] ?? '') || ($meta['stage'] ?? null) !== drStage($name)) throw new RuntimeException('Unapproved manifest entry.');
        if (!preg_match('/^[a-f0-9]{64}$/D', $meta['expectedBefore'] ?? '')) throw new RuntimeException('Invalid destination precondition.');
        $total += $meta['bytes']; if ($total > 8000000) throw new RuntimeException('Manifest total exceeds bound.');
        $metadata[$name] = $meta;
    }
    $archive = $work . '/files.zip';
    if (drHash($archive) !== $spec['archiveSha256'] || filesize($archive) !== $spec['archiveBytes']) {
        $url = 'https://raw.githubusercontent.com/DattaDhebe/dhebe-studios/' . $spec['archiveCommit'] . '/files.zip';
        $temporary = tempnam($work, 'download-');
        if ($temporary === false) throw new RuntimeException('Archive staging unavailable.');
        $stream = fopen($temporary, 'wb'); $received = 0; $curl = curl_init($url);
        if (!$stream || !$curl) throw new RuntimeException('Archive transport unavailable.');
        curl_setopt_array($curl, [CURLOPT_FOLLOWLOCATION => false, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_TIMEOUT => 120, CURLOPT_CONNECTTIMEOUT => 20, CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_USERAGENT => 'Dhebe-bounded-static-overlay/1', CURLOPT_WRITEFUNCTION => static function($handle, string $chunk) use ($stream, &$received, $spec): int { $received += strlen($chunk); if ($received > $spec['archiveBytes']) return 0; return fwrite($stream, $chunk); }]);
        $ok = curl_exec($curl); $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl); fclose($stream);
        if (!$ok || $status !== 200 || $received !== $spec['archiveBytes'] || drHash($temporary) !== $spec['archiveSha256']) { unlink($temporary); throw new RuntimeException('Pinned archive verification failed.'); }
        if (!chmod($temporary, 0600) || !rename($temporary, $archive)) throw new RuntimeException('Archive persistence failed.');
    }
    $zip = new ZipArchive();
    if ($zip->open($archive) !== true || $zip->numFiles !== count($metadata)) throw new RuntimeException('Archive file set mismatch.');
    $seen = [];
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $name = $zip->getNameIndex($i); $meta = $metadata[$name] ?? null;
        if (!$meta || isset($seen[$name])) throw new RuntimeException('Archive path mismatch.');
        $seen[$name] = true; $stat = $zip->statIndex($i);
        if (!is_array($stat) || $stat['size'] !== $meta['bytes']) throw new RuntimeException('Archive size mismatch.');
        $bytes = $zip->getFromIndex($i);
        if (!is_string($bytes) || strlen($bytes) !== $meta['bytes'] || hash('sha256', $bytes) !== $meta['sha256']) throw new RuntimeException('Archive checksum mismatch.');
        if (str_ends_with($name, '.php')) token_get_all($bytes, TOKEN_PARSE);
        $target = drTarget($root, $name); $original[$name] = drHash($target);
        if (array_key_exists('expectedBefore', $meta) && $meta['expectedBefore'] !== $original[$name]) throw new RuntimeException('Destination changed since review.');
    }
    $protected = drProtected($root, $metadata);
    drDirectory($work . '/backup');
    drAtomic($work . '/before.json', json_encode(['files' => $original, 'protected' => $protected], JSON_THROW_ON_ERROR), 0600);
    // Preserve every overwritten file before changing any public asset or handler.
    foreach ($metadata as $name => $meta) {
        if ($original[$name] === null || $original[$name] === $meta['sha256']) continue;
        $backup = $work . '/backup/' . $name; drDirectory(dirname($backup));
        if (!copy(drTarget($root, $name), $backup) || !chmod($backup, 0600) || drHash($backup) !== $original[$name]) throw new RuntimeException('Private backup failed.');
    }
    $names = array_keys($metadata);
    usort($names, static fn(string $a, string $b): int => ($metadata[$a]['stage'] <=> $metadata[$b]['stage']) ?: strcmp($a, $b));
    foreach ($names as $name) {
        $meta = $metadata[$name]; $target = drTarget($root, $name);
        if (drHash($target) !== $original[$name]) throw new RuntimeException('Concurrent destination change detected.');
        if ($original[$name] === $meta['sha256']) continue;
        drDirectory(dirname($target), 0755);
        $bytes = $zip->getFromName($name); if (!is_string($bytes)) throw new RuntimeException('Staged file unavailable.');
        drAtomic($target, $bytes, 0644); $written[] = $name;
        if (drHash($target) !== $meta['sha256']) throw new RuntimeException('Published file verification failed.');
    }
    if ($protected !== drProtected($root, $metadata)) throw new RuntimeException('Protected application changed.');
    foreach ($metadata as $name => $meta) if (drHash(drTarget($root, $name)) !== $meta['sha256']) throw new RuntimeException('Final manifest verification failed.');
    $zip->close(); $zip = null;
    $result = ['deployed' => true, 'release' => $spec['id'], 'archiveCommit' => $spec['archiveCommit'], 'manifestFiles' => count($metadata), 'changedFiles' => count($written), 'protectedApplicationsUnchanged' => true, 'completedAt' => gmdate('c')];
    drAtomic($work . '/complete.json', json_encode($result, JSON_THROW_ON_ERROR) . "\n", 0600);
    echo json_encode($result, JSON_THROW_ON_ERROR) . "\n";
} catch (Throwable $error) {
    $restored = true;
    if ($zip instanceof ZipArchive) $zip->close();
    foreach (array_reverse($written) as $name) {
        try {
            $target = drTarget($root, $name);
            if (drHash($target) !== $metadata[$name]['sha256']) { $restored = false; continue; }
            if ($original[$name] === null) { if (!unlink($target)) $restored = false; }
            else {
                $bytes = file_get_contents($work . '/backup/' . $name);
                if (!is_string($bytes) || hash('sha256', $bytes) !== $original[$name]) throw new RuntimeException('Backup checksum mismatch.');
                drAtomic($target, $bytes, 0644);
                if (drHash($target) !== $original[$name]) $restored = false;
            }
        } catch (Throwable) { $restored = false; }
    }
    $result = ['deployed' => false, 'reason' => $error->getMessage(), 'restored' => $restored, 'written' => count($written)];
    if ($ownedLock) { try { drAtomic($work . '/failed.json', json_encode($result, JSON_THROW_ON_ERROR) . "\n", 0600); } catch (Throwable) {} }
    echo json_encode($result, JSON_THROW_ON_ERROR) . "\n"; exit(1);
}
