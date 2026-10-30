declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
ini_set('display_errors', '0');
ini_set('log_errors', '0');
umask(0077);
$spec = json_decode(base64_decode('eyJpZCI6ImNvZGVtZS1wcm9kdWN0LTIwMjYxMDMxIiwidHJhbnNwb3J0U2hhMjU2IjoiMDkyYTgzNjQ1OTg5MDk0Y2VjYjI4MzQ2ODljNTdkNTExMjc1ZWIyYWY3OGM1NjA2NDFlNzZlMjI0ZmYwZjBkYyIsInRyYW5zcG9ydEJ5dGVzIjoxMDU4ODUxLCJhcmNoaXZlU2hhMjU2IjoiYTA2ZDJhOTg2ODU5M2M3YjcwYTIyYmY0NmYzZDE0Nzk3NWYzMTdjNGQxNTdiNzFmMzk2ZDY4Y2RkMjhhM2YxZSIsImFyY2hpdmVCeXRlcyI6NzkzNjc0LCJwdWJsaWNLZXlTaGEyNTYiOiI3ZGU0ZDk5ODA1MWRiMTQyYTY3MmRkOTA4MmY2YzlhNGFlNzFhNzE5ZmU1ZWEwYzY0OGNjYjFiN2Y2ZTk1N2IxIiwiZmlsZXMiOlt7InBhdGgiOiJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvLmh0YWNjZXNzIiwiYnl0ZXMiOjQ2LCJzaGEyNTYiOiJiYjhlMWMxZGVjYzRkYmI2YzI3NzdmZTU5Mjc5NzAzNWE2ZTA5ZDZjMjVmMjM5ZmQ5MmFhNzIyOGU3NDMzYzMwIiwibW9kZSI6NDIwLCJzdGFnZSI6MX0seyJwYXRoIjoicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2luZGV4Lmh0bWwiLCJieXRlcyI6MTMzMTQsInNoYTI1NiI6IjQ1ZWE1YjNhNWY0N2M5YTE4NDVmZDUyZjI5OWRiMDgyOWIzMmIxMjA5MjYzNDAyYmY2YTZkZWM1NWFmMTNiMzYiLCJtb2RlIjo0MjAsInN0YWdlIjozfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvc3R5bGVzLmNzcyIsImJ5dGVzIjoxNDIwNCwic2hhMjU2IjoiZTdlYThiZjJhNjRhZDc0MzQxNjRkNDY0MjBkMWE0NmFmYjM0Nzk4MGJlMWUxY2ZjZDVkNGQ4YjFkNmI0MWFiNyIsIm1vZGUiOjQyMCwic3RhZ2UiOjF9LHsicGF0aCI6InB1YmxpY19odG1sL3Byb2R1Y3RzL2NvZGVtZS9jaGVja291dC5tanMiLCJieXRlcyI6MjA3OTYsInNoYTI1NiI6IjQ1ZGQ1NDQzYmM5NzQ1NDU4ODJlOTQ4ZmMxNTBkYTMxNzQ0MTkzZTZjOTk1YjBiMTAzYzg0YzVmZmE3OTFhN2EiLCJtb2RlIjo0MjAsInN0YWdlIjoxfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvYXNzZXRzL2NvZGVtZS1sb2dvLnN2ZyIsImJ5dGVzIjo0MTIsInNoYTI1NiI6IjYwNWY4ODk4ZTZkYmIwN2FiZDg2ZDIwMjQ5ZWRjY2JiZjY5MmJmM2U1ODgxMmZkMmZmYzMzZDAzMjYzNGIwMGIiLCJtb2RlIjo0MjAsInN0YWdlIjoxfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9wcm9kdWN0cy9jb2RlbWUvYXNzZXRzL2NvZGVtZS13b3JkbWFyay1saWdodC5zdmciLCJieXRlcyI6NzA2LCJzaGEyNTYiOiJhY2MyNDBiNzU1OGRkOWQ0YjM3MzBmZGM1YjNlZmZjNDAwZmZmOGMzZjNmOWM3YzI2NWMwYWVlMzVjZDAwNDY2IiwibW9kZSI6NDIwLCJzdGFnZSI6MX0seyJwYXRoIjoicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2Fzc2V0cy9jb2RlbWUtNTEyLnBuZyIsImJ5dGVzIjo1NzA4LCJzaGEyNTYiOiIyZWY1ZDQ4Mzg3ZmM3YTZjMDhmYjI2Y2M1N2Y0MTdhNDljZDk4OWJhMzQ5NDJhYWIxY2JmYjIxOTdkNTliMzUwIiwibW9kZSI6NDIwLCJzdGFnZSI6MX0seyJwYXRoIjoicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2FwaS9fYm9vdHN0cmFwLnBocCIsImJ5dGVzIjoyMDQ4LCJzaGEyNTYiOiI3Mzc1ZjRmNjdmMWEwZGE3MzVkMGI3MjYwZjUxNmFiMGQxNGJmNDk5ZDc3MGQ5ZDU3OTY1Y2RmODgwZGVhYWFlIiwibW9kZSI6NDIwLCJzdGFnZSI6Mn0seyJwYXRoIjoicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2FwaS9wYXltZW50cy5waHAiLCJieXRlcyI6MTA2LCJzaGEyNTYiOiI1YzM5NTZjNGQ5NThhZDJkZTExMWQyY2MxZDJiNmQ1Y2IxYTNkMDkzZWE2YTE3NGY2OTc4YTY4MGYyZGE2ZTQ0IiwibW9kZSI6NDIwLCJzdGFnZSI6Mn0seyJwYXRoIjoicHVibGljX2h0bWwvcHJvZHVjdHMvY29kZW1lL2FwaS9kb3dubG9hZC5waHAiLCJieXRlcyI6MTA2LCJzaGEyNTYiOiI2ODNmNTYxYTJkNTlkNmJlOGI2M2I0NTU3Y2I0YjMzNGU0NjBiMGJhNTlkZDVkOGNjZGM3ZDBlODM1ZGMyNTczIiwibW9kZSI6NDIwLCJzdGFnZSI6Mn0seyJwYXRoIjoiY29kZW1lLXBheW1lbnRzLXByaXZhdGUvYm9vdHN0cmFwLnBocCIsImJ5dGVzIjoxMDQ4Nywic2hhMjU2IjoiNDQ4MDdhYjNiM2M4ZWFlZWEyODg1ZGVmMDExZWVhNWJkMzM0MzExMDMzZjNjM2U5NTkwMDM0ZTcwZjQxOWY1YiIsIm1vZGUiOjM4NCwic3RhZ2UiOjB9LHsicGF0aCI6ImNvZGVtZS1wYXltZW50cy1wcml2YXRlL2NvbmZpZy5waHAiLCJieXRlcyI6NjU5LCJzaGEyNTYiOiI0ZGZjNmViZWZlYjNlYTIwMWRlYmMyNzMzMmRkOTNlNDVjODgyZmY2ZTQ0ZTcyNWZkMzc1NjE1YTgzNjJkOTE3IiwibW9kZSI6Mzg0LCJzdGFnZSI6MH0seyJwYXRoIjoiY29kZW1lLXBheW1lbnRzLXByaXZhdGUvbGliL0NvbW1lcmNlLnBocCIsImJ5dGVzIjoyNTkxOSwic2hhMjU2IjoiZjI0MzFhODU3ODVmNDg1NDRjMWNlZGNkODJlNTgzMWI3N2U4YTc4ZDYxYmI3ZDJjZWExZDM2MWNkNDFmMDA0ZiIsIm1vZGUiOjM4NCwic3RhZ2UiOjB9LHsicGF0aCI6ImNvZGVtZS1wYXltZW50cy1wcml2YXRlL2NoZWNrLWluc3RhbGwucGhwIiwiYnl0ZXMiOjExNTksInNoYTI1NiI6Ijc1OGNlYzQ4YmNiYjljZDE3N2Y5MjIzOTJhMDVhMDJlZWIyZDQ4MjVjYzU4ZDNhMjE3NzE3YjRiOTAzYmY4ZjEiLCJtb2RlIjozODQsInN0YWdlIjowfSx7InBhdGgiOiJjb2RlbWUtcGF5bWVudHMtcHJpdmF0ZS9yZWxlYXNlcy9jb2RlbWUtMC43LjAtbG9jYWwtYzAxNTc0OWE3ZDkzLnppcCIsImJ5dGVzIjo2Mzg0MzIsInNoYTI1NiI6IjZmNjQwYzYxYmIzYjgzYjU3OGIwNzQwNTI1ZWJlNjViNWY2NzdmODA0MjJlZGI0N2FiZDhhM2FmMjIxZDg2MzkiLCJtb2RlIjozODQsInN0YWdlIjowfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9fbmV4dC9zdGF0aWMvY2h1bmtzLzBrZHFoNHFmcjlrZTcuY3NzIiwiYnl0ZXMiOjIxODMsInNoYTI1NiI6IjRkOTU3MTQwOTBlYzFhODE2ZjNiMjlhYTI2ZDQ4YjFmODMxMmViMGZhMmRlODY4N2UxMzdhOTkyYmM3OTYwNTkiLCJtb2RlIjo0MjAsInN0YWdlIjoxfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9fbmV4dC9zdGF0aWMvY2h1bmtzLzF5aTQ4Xzg5YnI3X2ouanMiLCJieXRlcyI6NDE1MjQsInNoYTI1NiI6IjQwY2Y1MmExOWI2YWU2Y2VkNzQwZWU3M2YxYTNkNmMxZDNhYjRhMTA3NDRkZjQwMGMwNTEzOTMwYTlkYzM2OWYiLCJtb2RlIjo0MjAsInN0YWdlIjoxfSx7InBhdGgiOiJwdWJsaWNfaHRtbC9fbmV4dC9zdGF0aWMvTlJ1ZTFtVDFLWkZGVU1Cd0dpcENjL19idWlsZE1hbmlmZXN0LmpzIiwiYnl0ZXMiOjIxOSwic2hhMjU2IjoiOTQ3NmUwYWZkM2Y5ZGE2OGE2NGU2ZWM1ODYzMTE5MWZkM2VhY2E2MmM5ZjVhMzc3ZTc1MTdmZTlhODllNTllYSIsIm1vZGUiOjQyMCwic3RhZ2UiOjF9LHsicGF0aCI6InB1YmxpY19odG1sL19uZXh0L3N0YXRpYy9OUnVlMW1UMUtaRkZVTUJ3R2lwQ2MvX2NsaWVudE1pZGRsZXdhcmVNYW5pZmVzdC5qcyIsImJ5dGVzIjo5Niwic2hhMjU2IjoiNTQ4M2UzMjk1ZGMzNWRmZTI5ZWE5MzJlZmM4NTM0MWM5MTZmMTBmZjc4ZmY1YjBlOTY1ZTAwMzcxMDg5M2E0YSIsIm1vZGUiOjQyMCwic3RhZ2UiOjF9LHsicGF0aCI6InB1YmxpY19odG1sL19uZXh0L3N0YXRpYy9OUnVlMW1UMUtaRkZVTUJ3R2lwQ2MvX3NzZ01hbmlmZXN0LmpzIiwiYnl0ZXMiOjI0Nywic2hhMjU2IjoiMzk2NjUwYmYyOGViYjZiYmI5ODE4NDMyM2E1ZjMyMDgwMmI3ZjAyNzNhNjhjOWVjZjQ1Zjk1MjBmYWIxNGZjOSIsIm1vZGUiOjQyMCwic3RhZ2UiOjF9LHsicGF0aCI6InB1YmxpY19odG1sL2luZGV4Lmh0bWwiLCJieXRlcyI6MjYyNTU4LCJzaGEyNTYiOiJlNGIyOGMzMDBkZTNiNjFlNzUwN2UxMDhjMDYwMzc0ZWViN2MyYzI3OTEwOTM0NjlhNjBhYjI2N2M1ZDEyYTgzIiwibW9kZSI6NDIwLCJzdGFnZSI6NSwiZXhwZWN0ZWRCZWZvcmUiOiIzMTY0YWY5ZTljYmU5OGVhODEwODgyOTBhM2YwODNjMTBkMDY0NzJkOGM1N2FlOWI0MWJhYjgzYTNlNmMwNmI1In0seyJwYXRoIjoicHVibGljX2h0bWwvaW5kZXgudHh0IiwiYnl0ZXMiOjEyODM3MSwic2hhMjU2IjoiOWQ3YWQ3OTlmZjI3ZDg2ODc1NjJiMThkNDc4YmJlMzYyYjgxMjBmYmQwNmMyNmNjMTM2Yzc2NzQ4NGE2NDNkNiIsIm1vZGUiOjQyMCwic3RhZ2UiOjQsImV4cGVjdGVkQmVmb3JlIjoiYzNmZjkwMmVkZDEyYjZkYTFhMDc2MDA5MWJiZDkzNDFlZDc2YTgxYmViZDFjZDI3OWE1OTg5YTU3MTIwNzM4YiJ9LHsicGF0aCI6InB1YmxpY19odG1sL19fbmV4dC5fZnVsbC50eHQiLCJieXRlcyI6MTI4MzcxLCJzaGEyNTYiOiI5ZDdhZDc5OWZmMjdkODY4NzU2MmIxOGQ0NzhiYmUzNjJiODEyMGZiZDA2YzI2Y2MxMzZjNzY3NDg0YTY0M2Q2IiwibW9kZSI6NDIwLCJzdGFnZSI6NCwiZXhwZWN0ZWRCZWZvcmUiOiJjM2ZmOTAyZWRkMTJiNmRhMWEwNzYwMDkxYmJkOTM0MWVkNzZhODFiZWJkMWNkMjc5YTU5ODlhNTcxMjA3MzhiIn0seyJwYXRoIjoicHVibGljX2h0bWwvX19uZXh0Ll9pbmRleC50eHQiLCJieXRlcyI6ODYyNCwic2hhMjU2IjoiN2FjYjliZmI2OThjYzNjNGEzYjY5MjZhNjkwNzkwMzU4ZmFlNmU5ZmRkYjNlNzBkYjJlM2EyZTk3MzM1YmM0MCIsIm1vZGUiOjQyMCwic3RhZ2UiOjQsImV4cGVjdGVkQmVmb3JlIjoiMTA4ODIwNmM1ODljZTdhOGJjMDQwZDY3MTU2MDBhYWM5ZmQ3YWE2NmEwY2RjNWY4ZjVmOGY2NDZiMzMzZWNjYyJ9LHsicGF0aCI6InB1YmxpY19odG1sL19fbmV4dC5fdHJlZS50eHQiLCJieXRlcyI6NDAyLCJzaGEyNTYiOiJmNjcxYWQ1MDBmZjJjM2VlYzdlNDQwMWVkZDdlNjExODlhODViNjQ4MjVkNmM4ODU4NTUyNGJjYjdiNjIwNDZmIiwibW9kZSI6NDIwLCJzdGFnZSI6NCwiZXhwZWN0ZWRCZWZvcmUiOiJhMTYyZTExZWQxOTk3NTQxZGUwNDc4YjYzMWE1ZDc3ZDc1YzZkYTYwYTU5OGRlZDBmYmUxZWQ0Yjk4YTRlMWNjIn0seyJwYXRoIjoicHVibGljX2h0bWwvX19uZXh0Ll9fUEFHRV9fLnR4dCIsImJ5dGVzIjoxMjA3NjMsInNoYTI1NiI6IjA4MWVlZjA4ODVkOTVkYjRiMjRmODYwNWU5MDk4YTRmNTdlNjViMGIzMGRhYWMwZmQ1NGQ0MWFkM2JhZGE1MGQiLCJtb2RlIjo0MjAsInN0YWdlIjo0LCJleHBlY3RlZEJlZm9yZSI6ImMyMTgxN2I4ZTlkMmI2NzU5NmFjMGM1MWFjOWRhNDMyYTkxOTk4MDk5MGU5OThjOGIwZmM0ZDEwMzc3ODNiOGMifV19', true), true, 32, JSON_THROW_ON_ERROR);
$domain = '/home/u942725982/domains/dhebe.com';
$work = $domain . '/private/site-releases/codeme-product-20261031';

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
    $result = [];
    foreach (['public_html/.htaccess', 'careerlift-payments-private/config.php', 'public_html/api/careers-apply.php', 'public_html/api/careers-roles.json', 'public_html/api/dhebevoice-signup.php', 'public_html/api/dhebevoice-smtp.php'] as $path) {
        $result[$path] = cdHash(cdTarget($domain, $path));
    }
    return $result;
}
function cdRule(string $name): ?array {
    $private = ['bootstrap.php', 'config.php', 'lib/Commerce.php', 'check-install.php', 'releases/codeme-0.7.0-local-c015749a7d93.zip'];
    foreach ($private as $path) if ($name === 'codeme-payments-private/' . $path) return [0, 0600, str_starts_with($path, 'releases/')];
    $product = 'public_html/products/codeme/';
    if (str_starts_with($name, $product)) {
        $path = substr($name, strlen($product));
        if (in_array($path, ['.htaccess', 'styles.css', 'checkout.mjs', 'assets/codeme-logo.svg', 'assets/codeme-wordmark-light.svg', 'assets/codeme-512.png'], true)) return [1, 0644, false];
        if (in_array($path, ['api/_bootstrap.php', 'api/payments.php', 'api/download.php'], true)) return [2, 0644, false];
        if ($path === 'index.html') return [3, 0644, false];
        return null;
    }
    if (preg_match('~^public_html/_next/static/[a-zA-Z0-9_.-]+(?:/[a-zA-Z0-9_.-]+)*\.(?:js|css)$~D', $name)) return [1, 0644, true];
    if (in_array($name, ['public_html/index.txt', 'public_html/__next.__PAGE__.txt', 'public_html/__next._full.txt', 'public_html/__next._index.txt', 'public_html/__next._tree.txt'], true)) return [4, 0644, false];
    if ($name === 'public_html/index.html') return [5, 0644, false];
    return null;
}
function cdReadiness(string $domain): array {
    // Keep bootstrap top-level variables inside this scope; never emit the config.
    require_once $domain . '/codeme-payments-private/bootstrap.php';
    try {
        $config = \CodeMe\Payments\configuration(['DOCUMENT_ROOT' => $domain . '/public_html']);
        $store = new \CodeMe\Payments\FileStore($config['runtime_dir']);
        $ready = ['privateInstall' => true, 'connectionReady' => $config['configured'] === true, 'mode' => $config['mode'], 'enabled' => $config['enabled'] === true,
            'downloadReady' => $config['download_ready'] === true, 'product' => \CodeMe\Payments\PRODUCT, 'amountPaise' => \CodeMe\Payments\AMOUNT_PAISE,
            'currency' => \CodeMe\Payments\CURRENCY, 'version' => $config['version'], 'sha256' => $config['archive_sha256']];
        unset($config, $store);
        if (!$ready['connectionReady'] || !$ready['enabled'] || !$ready['downloadReady'] || $ready['mode'] !== 'production' || $ready['amountPaise'] !== 49900 || $ready['currency'] !== 'INR') throw new RuntimeException('not_ready');
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
    if (($spec['id'] ?? '') !== 'codeme-product-20261031' || (isset($spec['payloadCommit']) && !preg_match('/^[a-f0-9]{40}$/D', $spec['payloadCommit']))) throw new RuntimeException('Invalid release identity.');
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
    if (!is_array($spec['files'] ?? null) || count($spec['files']) < 15 || count($spec['files']) > 128) throw new RuntimeException('Invalid release manifest.');
    foreach ($spec['files'] as $meta) {
        if (!is_array($meta) || !is_string($meta['path'] ?? null)) throw new RuntimeException('Invalid manifest entry.');
        $name = $meta['path']; $rule = cdRule($name);
        if (!$rule || isset($metadata[$name]) || str_contains($name, '..') || str_contains($name, '\\') || str_contains($name, "\0") ||
            !is_int($meta['bytes'] ?? null) || $meta['bytes'] < 0 || $meta['bytes'] > 8000000 || !preg_match('/^[a-f0-9]{64}$/D', $meta['sha256'] ?? '') ||
            ($meta['stage'] ?? null) !== $rule[0] || ($meta['mode'] ?? null) !== $rule[1]) throw new RuntimeException('Unapproved manifest entry.');
        if ($rule[0] >= 4 && (!array_key_exists('expectedBefore', $meta) || !preg_match('/^[a-f0-9]{64}$/D', $meta['expectedBefore'] ?? ''))) throw new RuntimeException('Homepage precondition missing.');
        if (array_key_exists('expectedBefore', $meta) && $meta['expectedBefore'] !== null && !preg_match('/^[a-f0-9]{64}$/D', $meta['expectedBefore'])) throw new RuntimeException('Invalid destination precondition.');
        $meta['immutable'] = $rule[2]; $metadata[$name] = $meta;
    }
    foreach (['codeme-payments-private/bootstrap.php', 'codeme-payments-private/config.php', 'codeme-payments-private/lib/Commerce.php', 'codeme-payments-private/check-install.php', 'codeme-payments-private/releases/codeme-0.7.0-local-c015749a7d93.zip', 'public_html/products/codeme/index.html', 'public_html/products/codeme/.htaccess', 'public_html/products/codeme/api/_bootstrap.php', 'public_html/products/codeme/api/payments.php', 'public_html/products/codeme/api/download.php', 'public_html/index.html'] as $required) if (!isset($metadata[$required])) throw new RuntimeException('Required product file missing.');
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
        if ($meta['stage'] >= 4 && $ready === null) $ready = cdReadiness($domain);
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
