<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
error_reporting(E_ALL);
set_error_handler(static function(int $severity, string $message, string $file, int $line): bool {
    if (error_reporting() & $severity) throw new ErrorException($message, 0, $severity, $file, $line);
    return false;
});
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/signup.php';
require __DIR__ . '/verification-tests.php';
require __DIR__ . '/smtp-tests.php';
