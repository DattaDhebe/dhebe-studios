declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0');
ini_set('log_errors', '0');
umask(0077);
$spec = json_decode(base64_decode('eyJpZCI6ImNvZGVtZS1tYWludGVuYW5jZS0yMDI2MTAzMS0wMiIsInBheWxvYWRDb21taXQiOiJlN2YxYzhkZTdhYjhlYmNmNDdlMGQwYTY0ZDUyMzY0NTQ2NmRmNjVkIiwidHJhbnNwb3J0U2hhMjU2IjoiYmNmNjg3NWJjOTU4NTNlOGM4NzhkMDllZGY2ZTljMWQ1MzEyZWVjOGI0MTVhYzQzNjU1ZGU0MGY3N2ZhOTM1YyIsInRyYW5zcG9ydEJ5dGVzIjo4NDIyMTEsImFyY2hpdmVTaGEyNTYiOiI0ZmIzYzU1NjUzNjk4ZDAwNTY0Mzk0ODc4MDUwNDFkMGQwMDE3NGVmMjMwZDQxN2Q3OTdkMDY5ZDgzMTg4MDE2IiwiYXJjaGl2ZUJ5dGVzIjo2MzExOTQsInB1YmxpY0tleVNoYTI1NiI6IjY4ZjJkMDI1Yjg1MGYyYjkyMGY2MzE3NDczNzE5ZTIyMDkyMWUzMWJkNDQxMjMwMzQyNGJmMTMxYzJiMTRiYTQiLCJwcm90ZWN0ZWRCZWZvcmUiOnsicHVibGljX2h0bWwvLmh0YWNjZXNzIjoiOTBjN2IzNGZlNDUyZTQwZGJlNDVjMTUwMThjM2M2MjVmMmIxNjI1NjIwZTIxMDhlOTI4NWJmYzM0YmEyNDdjYiIsInB1YmxpY19odG1sL2luZGV4Lmh0bWwiOiI4OTUxMTRlNDMwMzFmZmRhNWY4NWFiOWQwMGQzOTZlNTViMjAyOGUxZGMzMzJkY2JjZGFkMzI1M2I5OGFhMTA4IiwicHVibGljX2h0bWwvaW5kZXgudHh0IjoiYTI3MDExYTZiNmQ3MTRjMGRiOTljYzYwOWQwMGZjYjFhMDZhYjAwOTA3ZjViNmYxYjFiMGRhYmRmMWY0NWZiYSIsInB1YmxpY19odG1sL19fbmV4dC5fX1BBR0VfXy50eHQiOiJiZGYzN2IxYjE0ODlhYmZlNDZmZjdiYTBhNTI5Mjg5NzU5ZTYzNWYzZWJhMGI0YzQwYzUxMzk4NjM2MWJkOTNmIiwicHVibGljX2h0bWwvX19uZXh0Ll9mdWxsLnR4dCI6ImEyNzAxMWE2YjZkNzE0YzBkYjk5Y2M2MDlkMDBmY2IxYTA2YWIwMDkwN2Y1YjZmMWIxYjBkYWJkZjFmNDVmYmEiLCJwdWJsaWNfaHRtbC9fX25leHQuX2luZGV4LnR4dCI6ImEyYzAzOTBmZDVkODdkMWViMjEzOTAwOGViMzNlYzZkNGY1OTBiZTE0MTlhOTc5MjkwZDc5NDU0Mjg0YzgyNjkiLCJwdWJsaWNfaHRtbC9fX25leHQuX3RyZWUudHh0IjoiNWVmYjQ5OGM0YTZhMDgwN2Y5ZmY5YjFkNmQ4MTEzZTUxNWMyMTU5MjU0NWNmZGFlMTE4NTA1NzlmNTdhNDlmYSIsImNhcmVlcmxpZnQtcGF5bWVudHMtcHJpdmF0ZS9jb25maWcucGhwIjoiNmNmYWYxMDhmMDYyYmZlYWExZjE1MjUzMmU5ODRkYjVkMWZiNzUzMTUwY2Q1MmNmYTJmNzhhNjkzMzdmZmU0MCIsImNvZGVtZS1wYXltZW50cy1wcml2YXRlL2Jvb3RzdHJhcC5waHAiOiI0NDgwN2FiM2IzYzhlYWVlYTI4ODVkZWYwMTFlZWE1YmQzMzQzMTEwMzNmM2MzZTk1OTAwMzRlNzBmNDE5ZjViIiwiY29kZW1lLXBheW1lbnRzLXByaXZhdGUvbGliL0NvbW1lcmNlLnBocCI6IjJkMzZlZjc3NWY2OTI0NjE4OTk4ZDQ1MmJlNTc0NDgyMzdiNDkxODMwMWQ4ZjQ1ZjA1MzlmYmJlOTkxYmZiMDMiLCJjb2RlbWUtcGF5bWVudHMtcHJpdmF0ZS9jaGVjay1pbnN0YWxsLnBocCI6Ijc1OGNlYzQ4YmNiYjljZDE3N2Y5MjIzOTJhMDVhMDJlZWIyZDQ4MjVjYzU4ZDNhMjE3NzE3YjRiOTAzYmY4ZjEiLCJjb2RlbWUtcGF5bWVudHMtcHJpdmF0ZS9yZWxlYXNlcy9jb2RlbWUtMC43LjAtbG9jYWwtYzAxNTc0OWE3ZDkzLnppcCI6IjZmNjQwYzYxYmIzYjgzYjU3OGIwNzQwNTI1ZWJlNjViNWY2NzdmODA0MjJlZGI0N2FiZDhhM2FmMjIxZDg2MzkiLCJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvLmh0YWNjZXNzIjoiYmI4ZTFjMWRlY2M0ZGJiNmMyNzc3ZmU1OTI3OTcwMzVhNmUwOWQ2YzI1ZjIzOWZkOTJhYTcyMjhlNzQzM2MzMCIsInB1YmxpY19odG1sL3Byb2R1Y3RzL2NvZGVtZS9pbmRleC5odG1sIjoiNGZiZWM0Mzg3NzM5ZTEzYWJhZjJhN2E2MzY4ZDc1NzYyM2UyMWFhOTkwMDFjMTRjOTNkNDY4NWYzZjEzNTY2ZCIsInB1YmxpY19odG1sL3Byb2R1Y3RzL2NvZGVtZS9zdHlsZXMuY3NzIjoiMjEyYTM2OWU5MzM2OGEwNWFlMWIyYTk5NjcyYzU0ZjJmOTNjNjk3OGQ5MTQxMjdmNThlMWJiNWViYWJhMzc3NiIsInB1YmxpY19odG1sL3Byb2R1Y3RzL2NvZGVtZS9jaGVja291dC5tanMiOiI0NWRkNTQ0M2JjOTc0NTQ1ODgyZTk0OGZjMTUwZGEzMTc0NDE5M2U2Yzk5NWIwYjEwM2M4NGM1ZmZhNzkxYTdhIiwicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2Fzc2V0cy9jb2RlbWUtbG9nby5zdmciOiI2MDVmODg5OGU2ZGJiMDdhYmQ4NmQyMDI0OWVkY2NiYmY2OTJiZjNlNTg4MTJmZDJmZmMzM2QwMzI2MzRiMDBiIiwicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2Fzc2V0cy9jb2RlbWUtd29yZG1hcmstbGlnaHQuc3ZnIjoiYWNjMjQwYjc1NThkZDlkNGIzNzMwZmRjNWIzZWZmYzQwMGZmZjhjM2YzZjljN2MyNjVjMGFlZTM1Y2QwMDQ2NiIsInB1YmxpY19odG1sL3Byb2R1Y3RzL2NvZGVtZS9hc3NldHMvY29kZW1lLTUxMi5wbmciOiIyZWY1ZDQ4Mzg3ZmM3YTZjMDhmYjI2Y2M1N2Y0MTdhNDljZDk4OWJhMzQ5NDJhYWIxY2JmYjIxOTdkNTliMzUwIiwicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2FwaS9fYm9vdHN0cmFwLnBocCI6IjczNzVmNGY2N2YxYTBkYTczNWQwYjcyNjBmNTE2YWIwZDE0YmY0OTlkNzcwZDlkNTc5NjVjZGY4ODBkZWFhYWUiLCJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvYXBpL3BheW1lbnRzLnBocCI6IjVjMzk1NmM0ZDk1OGFkMmRlMTExZDJjYzFkMmI2ZDVjYjFhM2QwOTNlYTZhMTc0ZjY5NzhhNjgwZjJkYTZlNDQiLCJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvYXBpL2Rvd25sb2FkLnBocCI6IjY4M2Y1NjFhMmQ1OWQ2YmU4YjYzYjQ1NTdjYjRiMzM0ZTQ2MGIwYmE1OWRkNWQ4Y2NkYzdkMGU4MzVkYzI1NzMiLCJwdWJsaWNfaHRtbC9hcGkvY2FyZWVycy1hcHBseS5waHAiOiJiY2JhNWFiYzQ2YWEwZTE4ZGQxMmIxMzA2ZTgzYWYxNGVlYmUwMzZhZTdlZDM3OGYxZDM2MTg2OTFjOWYwZDUwIiwicHVibGljX2h0bWwvYXBpL2NhcmVlcnMtcm9sZXMuanNvbiI6IjU2MDY1OTI1ZjVjMzU2ZjczMjhhOTM5MWQ4ZWI3MTlkNzE3OTM4MWFhODJmYzgxYWQ3ZGFkNWRhYmI4ZTcxODYiLCJwdWJsaWNfaHRtbC9hcGkvZGhlYmV2b2ljZS1zaWdudXAucGhwIjoiYjYzMWI3ZWUyMjc1M2JlNzY1Mzk4MzA3NTRlZjk2ZWVmZDg5NjlmNDA0ZThkZDczMDY1MzAxYzI5NjJiOTI3MCIsInB1YmxpY19odG1sL2FwaS9kaGViZXZvaWNlLXNtdHAucGhwIjoiNjUzNDEwZjI1NWEzYmZlYWM4MzdiNjZhMzkyNDQzN2ZkYzBiODJkMDgwMTgwNDc2N2Y5MzAwMjJlMTQyYTY3NyJ9LCJmaWxlcyI6W3sicGF0aCI6ImNvZGVtZS1wYXltZW50cy1wcml2YXRlL3JlbGVhc2VzL2NvZGVtZS0wLjcuMC1sb2NhbC05NTg3ZDBhNTczZTIuemlwIiwiYnl0ZXMiOjY0NDE3Miwic2hhMjU2IjoiMmEzNjMxOWRhOWZiZTNlNWQwM2U5ZGUwZGU0M2MwMWQxZGUwMWRmYjY3ODMwMGEyNTQ0MDIyZGM3MTI1NGI2NyIsIm1vZGUiOjM4NCwic3RhZ2UiOjAsImV4cGVjdGVkQmVmb3JlIjpudWxsfSx7InBhdGgiOiJjb2RlbWUtcGF5bWVudHMtcHJpdmF0ZS9jb25maWcucGhwIiwiYnl0ZXMiOjY1OSwic2hhMjU2IjoiYTNkYjc2Mjg1ZDQ4NTJhNzdlMDk0ZjlkNjFmMjY0ZjI2NDVjMzI1NjkzZWZmYTdkYTI4OWU0YjA4MDJkMjI3NSIsIm1vZGUiOjM4NCwic3RhZ2UiOjEsImV4cGVjdGVkQmVmb3JlIjoiNGRmYzZlYmVmZWIzZWEyMDFkZWJjMjczMzJkZDkzZTQ1Yzg4MmZmNmU0NGU3MjVmZDM3NTYxNWE4MzYyZDkxNyJ9XX0=', true), true, 32, JSON_THROW_ON_ERROR);
$domain = '/home/u942725982/domains/dhebe.com';
$work = $domain . '/private/site-releases/codeme-maintenance-20261031-02';

function cdDirectory(string $path, int $mode = 0700): void {
    if (is_link($path) || (file_exists($path) && !is_dir($path))) throw new RuntimeException('Unsafe directory.');
    $parent = dirname($path);
    if ($parent !== $path) cdDirectory($parent, $mode);
    if (!is_dir($path) && (!mkdir($path, $mode) || !chmod($path, $mode))) throw new RuntimeException('Directory creation failed.');
}
function cdTarget(string $domain, string $name): string {
    $cursor = $domain;
    foreach (explode('/', $name) as $part) {
        if ($part === '' || $part === '.' || $part === '..') throw new RuntimeException('Unsafe path component.');
        $cursor .= '/' . $part;
        if (is_link($cursor)) throw new RuntimeException('Linked deployment path refused.');
    }
    $target = $domain . '/' . $name;
    if (file_exists($target) && !is_file($target)) throw new RuntimeException('Invalid deployment file.');
    $cursor = dirname($target);
    while (strlen($cursor) > strlen($domain)) {
        if (file_exists($cursor) && !is_dir($cursor)) throw new RuntimeException('Invalid deployment directory.');
        $cursor = dirname($cursor);
    }
    return $target;
}
function cdAtomic(string $path, string $bytes, int $mode): void {
    if (is_link($path)) throw new RuntimeException('Linked write target refused.');
    $temporary = tempnam(dirname($path), '.codeme-');
    if ($temporary === false) throw new RuntimeException('Temporary write failed.');
    try {
        if (file_put_contents($temporary, $bytes, LOCK_EX) !== strlen($bytes) || !chmod($temporary, $mode) || !rename($temporary, $path)) throw new RuntimeException('Atomic write failed.');
    } finally { if (is_file($temporary)) unlink($temporary); }
}
function cdHash(string $path): ?string {
    if (is_link($path)) throw new RuntimeException('Linked file refused.');
    if (!file_exists($path)) return null;
    if (!is_file($path)) throw new RuntimeException('Expected regular file.');
    $hash = hash_file('sha256', $path);
    if (!is_string($hash)) throw new RuntimeException('File hashing failed.');
    return $hash;
}
function cdProtected(string $domain): array {
    // Fixed application files only. Never open, enumerate or hash purchase/session runtime.
    $paths = [
        'public_html/.htaccess', 'public_html/index.html', 'public_html/index.txt',
        'public_html/__next.__PAGE__.txt', 'public_html/__next._full.txt', 'public_html/__next._index.txt', 'public_html/__next._tree.txt',
        'careerlift-payments-private/config.php',
        'codeme-payments-private/bootstrap.php', 'codeme-payments-private/lib/Commerce.php', 'codeme-payments-private/check-install.php',
        'codeme-payments-private/releases/codeme-0.7.0-local-c015749a7d93.zip',
        'public_html/products/codeme/.htaccess', 'public_html/products/codeme/index.html',
        'public_html/products/codeme/styles.css', 'public_html/products/codeme/checkout.mjs',
        'public_html/products/codeme/assets/codeme-logo.svg', 'public_html/products/codeme/assets/codeme-wordmark-light.svg',
        'public_html/products/codeme/assets/codeme-512.png',
        'public_html/products/codeme/api/_bootstrap.php', 'public_html/products/codeme/api/payments.php', 'public_html/products/codeme/api/download.php',
        'public_html/api/careers-apply.php', 'public_html/api/careers-roles.json', 'public_html/api/dhebevoice-signup.php', 'public_html/api/dhebevoice-smtp.php'
    ];
    $result = [];
    foreach ($paths as $path) $result[$path] = cdHash(cdTarget($domain, $path));
    return $result;
}
function cdRule(string $name): ?array {
    if ($name === 'codeme-payments-private/releases/codeme-0.7.0-local-9587d0a573e2.zip') return [0, 0600, true];
    if ($name === 'codeme-payments-private/config.php') return [1, 0600, false];
    return null;
}
function cdReadiness(string $domain): array {
    // Keep bootstrap top-level variables inside this scope; never emit the config.
    require_once $domain . '/codeme-payments-private/bootstrap.php';
    try {
        $config = \CodeMe\Payments\configuration(['DOCUMENT_ROOT' => $domain . '/public_html']);
        $ready = ['privateInstall' => true, 'connectionReady' => $config['configured'] === true, 'mode' => $config['mode'], 'enabled' => $config['enabled'] === true,
            'downloadReady' => $config['download_ready'] === true, 'product' => \CodeMe\Payments\PRODUCT, 'amountPaise' => \CodeMe\Payments\AMOUNT_PAISE,
            'currency' => \CodeMe\Payments\CURRENCY, 'version' => $config['version'], 'sha256' => $config['archive_sha256']];
        unset($config);
        if (!$ready['connectionReady'] || !$ready['enabled'] || !$ready['downloadReady'] || $ready['mode'] !== 'production' || $ready['amountPaise'] !== 49900 || $ready['currency'] !== 'INR' || $ready['sha256'] !== '2a36319da9fbe3e5d03e9de0de43c01d1de01dfb678300a2544022dc71254b67') throw new RuntimeException('not_ready');
        return $ready;
    } catch (Throwable) { throw new RuntimeException('Installed product is not production ready.'); }
}
function cdCleanup(string $work, array $result): array {
    $path = $work . '/transfer-key.pem';
    $result['transferKeyRemoved'] = !file_exists($path) && !is_link($path);
    if (is_file($path) && !is_link($path)) $result['transferKeyRemoved'] = @unlink($path);
    $archive = $work . '/install.zip';
    $result['temporaryArchiveRemoved'] = !file_exists($archive) && !is_link($archive);
    if (is_file($archive) && !is_link($archive)) $result['temporaryArchiveRemoved'] = @unlink($archive);
    // Completion has already committed. A cleanup receipt problem must never roll back a live release.
    try { cdAtomic($work . '/complete.json', json_encode($result, JSON_THROW_ON_ERROR) . "\n", 0600); } catch (Throwable) {}
    return $result;
}

$ownedLock = false; $written = []; $original = []; $metadata = []; $zip = null; $ready = null;
try {
    if (($spec['id'] ?? '') !== 'codeme-maintenance-20261031-02' || (isset($spec['payloadCommit']) && !preg_match('/^[a-f0-9]{40}$/D', $spec['payloadCommit']))) throw new RuntimeException('Invalid release identity.');
    if (str_replace('\\', '/', (string)realpath($domain)) !== $domain || is_link($domain)) throw new RuntimeException('Unexpected domain directory.');
    cdDirectory($work);
    $lock = fopen($work . '/install.lock', 'c');
    if (!$lock) throw new RuntimeException('Release lock unavailable.');
    if (!flock($lock, LOCK_EX | LOCK_NB)) { echo "{\"deployed\":false,\"alreadyRunning\":true}\n"; exit; }
    $ownedLock = true;
    if (is_file($work . '/complete.json')) {
        $complete = json_decode(file_get_contents($work . '/complete.json'), true, 16, JSON_THROW_ON_ERROR);
        if (!is_array($complete) || ($complete['deployed'] ?? false) !== true || ($complete['release'] ?? '') !== $spec['id']) throw new RuntimeException('Invalid completion receipt.');
        echo json_encode(cdCleanup($work, $complete), JSON_THROW_ON_ERROR) . "\n"; exit;
    }
    if (is_file($work . '/failed.json')) throw new RuntimeException('Earlier installation failure requires review.');
    if (!function_exists('openssl_decrypt') || !class_exists('ZipArchive')) throw new RuntimeException('Required deployment extensions missing.');
    foreach (['transportSha256', 'archiveSha256'] as $key) if (!preg_match('/^[a-f0-9]{64}$/D', $spec[$key] ?? '')) throw new RuntimeException('Invalid release digest.');
    foreach (['transportBytes', 'archiveBytes'] as $key) if (!is_int($spec[$key] ?? null) || $spec[$key] < 1 || $spec[$key] > 16000000) throw new RuntimeException('Invalid release size.');
    if (!is_array($spec['files'] ?? null) || count($spec['files']) !== 2) throw new RuntimeException('Invalid release manifest.');
    foreach ($spec['files'] as $meta) {
        if (!is_array($meta) || !is_string($meta['path'] ?? null)) throw new RuntimeException('Invalid manifest entry.');
        $name = $meta['path']; $rule = cdRule($name);
        if (!$rule || isset($metadata[$name]) || str_contains($name, '..') || str_contains($name, '\\') || str_contains($name, "\0") ||
            !is_int($meta['bytes'] ?? null) || $meta['bytes'] < 0 || $meta['bytes'] > 8000000 || !preg_match('/^[a-f0-9]{64}$/D', $meta['sha256'] ?? '') ||
            ($meta['stage'] ?? null) !== $rule[0] || ($meta['mode'] ?? null) !== $rule[1]) throw new RuntimeException('Unapproved manifest entry.');
        if (!array_key_exists('expectedBefore', $meta) || ($rule[2] ? $meta['expectedBefore'] !== null : !preg_match('/^[a-f0-9]{64}$/D', $meta['expectedBefore'] ?? ''))) throw new RuntimeException('Destination precondition missing.');
        if (array_key_exists('expectedBefore', $meta) && $meta['expectedBefore'] !== null && !preg_match('/^[a-f0-9]{64}$/D', $meta['expectedBefore'])) throw new RuntimeException('Invalid destination precondition.');
        $meta['immutable'] = $rule[2]; $metadata[$name] = $meta;
    }
    foreach (['codeme-payments-private/releases/codeme-0.7.0-local-9587d0a573e2.zip', 'codeme-payments-private/config.php'] as $required) if (!isset($metadata[$required])) throw new RuntimeException('Required maintenance file missing.');
    // The owner-authorized HTTPS transfer stages ciphertext privately on this host.
    // Never fetch the paid payload from GitHub or any external storage provider.
    $transport = $work . '/e';
    if (cdHash($transport) !== $spec['transportSha256'] || filesize($transport) !== $spec['transportBytes']) throw new RuntimeException('Pre-staged encrypted transport verification failed.');
    $envelope = json_decode(file_get_contents($transport), true, 8, JSON_THROW_ON_ERROR);
    if (!is_array($envelope) || ($envelope['alg'] ?? '') !== 'RSA-OAEP-SHA1+A256GCM' || array_diff(array_keys($envelope), ['alg', 'key', 'iv', 'tag', 'data'])) throw new RuntimeException('Invalid encrypted transport.');
    foreach (['key', 'iv', 'tag', 'data'] as $field) {
        if (!is_string($envelope[$field] ?? null) || ($decoded = base64_decode($envelope[$field], true)) === false) throw new RuntimeException('Invalid transport encoding.');
        $envelope[$field] = $decoded;
    }
    if (strlen($envelope['iv']) !== 12 || strlen($envelope['tag']) !== 16 || strlen($envelope['key']) !== 384) throw new RuntimeException('Invalid transport parameters.');
    $keyPath = $work . '/transfer-key.pem';
    if (is_link($keyPath) || !is_file($keyPath)) throw new RuntimeException('Private transfer key unavailable.');
    $rsa = openssl_pkey_get_private(file_get_contents($keyPath));
    if (!$rsa || !openssl_private_decrypt($envelope['key'], $aes, $rsa, OPENSSL_PKCS1_OAEP_PADDING) || strlen($aes) !== 32) throw new RuntimeException('Private transport unwrap failed.');
    $plain = openssl_decrypt($envelope['data'], 'aes-256-gcm', $aes, OPENSSL_RAW_DATA, $envelope['iv'], $envelope['tag'], $spec['id']);
    unset($aes, $rsa, $envelope);
    if (!is_string($plain) || strlen($plain) !== $spec['archiveBytes'] || hash('sha256', $plain) !== $spec['archiveSha256']) throw new RuntimeException('Authenticated archive verification failed.');
    $archive = $work . '/install.zip'; cdAtomic($archive, $plain, 0600); unset($plain);
    $zip = new ZipArchive();
    if ($zip->open($archive) !== true || $zip->numFiles !== count($metadata)) throw new RuntimeException('Archive file set mismatch.');
    $seen = []; $total = 0;
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $name = $zip->getNameIndex($i); $meta = $metadata[$name] ?? null;
        if (!$meta || isset($seen[$name])) throw new RuntimeException('Archive path mismatch.');
        $seen[$name] = true; $stat = $zip->statIndex($i); $total += $meta['bytes'];
        if (!is_array($stat) || $stat['size'] !== $meta['bytes'] || $total > 16000000) throw new RuntimeException('Archive size mismatch.');
        $bytes = $zip->getFromIndex($i);
        if (!is_string($bytes) || strlen($bytes) !== $meta['bytes'] || hash('sha256', $bytes) !== $meta['sha256']) throw new RuntimeException('Archive checksum mismatch.');
        if (str_ends_with($name, '.php')) token_get_all($bytes, TOKEN_PARSE);
        $target = cdTarget($domain, $name); $original[$name] = cdHash($target);
        if (array_key_exists('expectedBefore', $meta) && $meta['expectedBefore'] !== $original[$name]) throw new RuntimeException('Destination changed since review.');
        if ($meta['immutable'] && $original[$name] !== null && $original[$name] !== $meta['sha256']) throw new RuntimeException('Immutable file conflict.');
    }
    $protected = cdProtected($domain);
    if (!is_array($spec['protectedBefore'] ?? null) || $spec['protectedBefore'] !== $protected) throw new RuntimeException('Protected application changed since review.');
    cdDirectory($work . '/backup');
    cdAtomic($work . '/before.json', json_encode(['files' => $original, 'protected' => $protected], JSON_THROW_ON_ERROR), 0600);
    // Back up every existing changed target before mutating any application file.
    foreach ($metadata as $name => $meta) {
        if ($original[$name] === null || $original[$name] === $meta['sha256']) continue;
        $backup = $work . '/backup/' . $name; cdDirectory(dirname($backup));
        if (!copy(cdTarget($domain, $name), $backup) || !chmod($backup, 0600) || cdHash($backup) !== $original[$name]) throw new RuntimeException('Private backup failed.');
    }
    $names = array_keys($metadata);
    usort($names, static fn(string $a, string $b): int => ($metadata[$a]['stage'] <=> $metadata[$b]['stage']) ?: strcmp($a, $b));
    foreach ($names as $name) {
        $meta = $metadata[$name];
        $target = cdTarget($domain, $name);
        if (cdHash($target) !== $original[$name]) throw new RuntimeException('Concurrent destination change detected.');
        if ($original[$name] === $meta['sha256']) continue;
        cdDirectory(dirname($target), $meta['mode'] === 0600 ? 0700 : 0755);
        $bytes = $zip->getFromName($name);
        if (!is_string($bytes)) throw new RuntimeException('Staged file unavailable.');
        cdAtomic($target, $bytes, $meta['mode']); $written[] = $name;
        if (cdHash($target) !== $meta['sha256']) throw new RuntimeException('Published file verification failed.');
    }
    if ($ready === null) $ready = cdReadiness($domain);
    if ($protected !== cdProtected($domain)) throw new RuntimeException('Protected application changed.');
    foreach ($metadata as $name => $meta) if (cdHash(cdTarget($domain, $name)) !== $meta['sha256']) throw new RuntimeException('Final manifest verification failed.');
    $zip->close(); $zip = null;
    $result = ['deployed' => true, 'release' => $spec['id'], 'payloadCommit' => $spec['payloadCommit'] ?? null, 'manifestFiles' => count($metadata), 'changedFiles' => count($written),
        'protectedApplicationsUnchanged' => true, 'readiness' => $ready, 'completedAt' => gmdate('c')];
    cdAtomic($work . '/complete.json', json_encode($result, JSON_THROW_ON_ERROR) . "\n", 0600);
    $result = cdCleanup($work, $result);
    echo json_encode($result, JSON_THROW_ON_ERROR) . "\n";
} catch (Throwable $error) {
    $restored = true;
    if ($zip instanceof ZipArchive) $zip->close();
    foreach (array_reverse($written) as $name) {
        try {
            $target = cdTarget($domain, $name);
            // Never overwrite a third-party concurrent edit during rollback.
            if (cdHash($target) !== $metadata[$name]['sha256']) { $restored = false; continue; }
            if ($original[$name] === null) { if (!unlink($target)) $restored = false; }
            else {
                $bytes = file_get_contents($work . '/backup/' . $name);
                if (!is_string($bytes) || hash('sha256', $bytes) !== $original[$name]) throw new RuntimeException('Backup checksum mismatch.');
                cdAtomic($target, $bytes, $metadata[$name]['mode']);
                if (cdHash($target) !== $original[$name]) $restored = false;
            }
        } catch (Throwable) { $restored = false; }
    }
    $result = ['deployed' => false, 'reason' => $error->getMessage(), 'restored' => $restored, 'written' => count($written)];
    if ($ownedLock) { try { cdAtomic($work . '/failed.json', json_encode($result, JSON_THROW_ON_ERROR) . "\n", 0600); } catch (Throwable) {} }
    echo json_encode($result, JSON_THROW_ON_ERROR) . "\n"; exit(1);
}
