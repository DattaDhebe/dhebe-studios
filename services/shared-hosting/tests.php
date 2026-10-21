<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/signup.php';
require __DIR__ . '/verification-tests.php';
