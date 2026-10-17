<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
define('DHEBE_SIGNUP_LIBRARY', true);
require __DIR__ . '/signup.php';
$root = sys_get_temp_dir() . '/dhebe-signup-' . bin2hex(random_bytes(8));
$now = 1792238400;
$server = ['REQUEST_METHOD' => 'POST', 'HTTP_ORIGIN' => 'https://www.dhebe.com', 'CONTENT_TYPE' => 'application/json'];
$tests = 0;
function check(bool $value): void { global $tests; $tests++; if (!$value) throw new RuntimeException('Assertion ' . $tests . ' failed.'); }
function request(array $data, array $override = []): array { global $root, $now, $server; return signup_request(array_replace($server, $override), json_encode($data), $root, $now); }
$input = ['email' => ' User@Example.com ', 'consent' => true, 'website' => ''];
check(request($input)[0] === 200);
check(request($input)[1] === ['request_received' => true]);
$db = signup_database($root);
check((int)$db->query('SELECT count(*) FROM signups')->fetchColumn() === 1);
check($db->query('SELECT email FROM signups')->fetchColumn() === 'user@example.com');
check($db->query('SELECT consent_version FROM signups')->fetchColumn() === DHEBE_CONSENT);
check((fileperms($root . '/testers.sqlite3') & 0777) === 0600);
check(request($input, ['REQUEST_METHOD' => 'GET'])[0] === 405);
check(request($input, ['HTTP_ORIGIN' => 'https://attacker.example'])[0] === 403);
check(request($input, ['CONTENT_TYPE' => 'text/plain'])[0] === 415);
check(request($input, ['CONTENT_LENGTH' => '1025'])[0] === 413);
check(signup_request($server, str_repeat('x', 1025), $root, $now)[0] === 413);
check(signup_request($server, '{', $root, $now)[0] === 400);
check(request(array_replace($input, ['consent' => 'true']))[0] === 400);
check(request(array_replace($input, ['website' => 'bot']))[0] === 400);
check(request(array_replace($input, ['extra' => 1]))[0] === 400);
foreach (['a..b@example.com', 'a@example', 'a@-example.com', "x\r\n@example.com", [], ''] as $bad) check(signup_email($bad) === null);
check(signup_email('a+b@example.com') === 'a+b@example.com');
$db->exec("INSERT INTO signups VALUES ('expired@example.com', '2000-01-01T00:00:00+00:00', 'old')");
request($input);
check((int)$db->query('SELECT count(*) FROM signups')->fetchColumn() === 1);
$db->exec('DELETE FROM request_buckets');
for ($i = 0; $i < 30; $i++) check(request($input)[0] === 200);
check(request($input)[0] === 429);
$now += 60;
check(request($input)[0] === 200);
echo json_encode(['checks_passed' => $tests]) . PHP_EOL;
