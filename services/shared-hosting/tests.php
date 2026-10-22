<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (isset($argv[1])) {
    if (!in_array($argv[1], ['dhebevoice', 'rivetprep', 'rostercairn'], true)) throw new RuntimeException('Unknown test app.');
    define('DHEBE_TESTER_APP', $argv[1]);
}
error_reporting(E_ALL);
set_error_handler(static function(int $severity, string $message, string $file, int $line): bool {
    if (error_reporting() & $severity) throw new ErrorException($message, 0, $severity, $file, $line);
    return false;
});
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/signup.php';
require __DIR__ . '/verification-tests.php';
require __DIR__ . '/smtp-tests.php';
require __DIR__ . '/retention-tests.php';
