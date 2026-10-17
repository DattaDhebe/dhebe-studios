<?php
declare(strict_types=1);
// Deploy only over this rollout's own temporary capability, then request it once.
if (PHP_SAPI === 'cli') exit;
http_response_code(404);
header('Cache-Control: no-store');
unlink(__FILE__);
