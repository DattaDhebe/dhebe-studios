if(PHP_SAPI!=="cli")exit(1);
ini_set("display_errors","0");ini_set("log_errors","0");umask(0077);
$base="/home/u942725982/domains/dhebe.com";
$work=$base."/private/site-releases/codeme-maintenance-20261031-02";
function kmHash(string $base,string $relative):?string {
 $cursor=$base;
 foreach(explode('/',$relative) as $part){if($part===''||$part==='.'||$part==='..')throw new RuntimeException('Unsafe path');$cursor.='/'.$part;if(is_link($cursor))throw new RuntimeException('Linked path refused');}
 if(!file_exists($cursor))return null;if(!is_file($cursor))throw new RuntimeException('Expected regular file');
 $hash=hash_file('sha256',$cursor);if(!is_string($hash))throw new RuntimeException('Hash failed');return $hash;
}
try{
 foreach([$base,$base."/private",$base."/private/site-releases",$work] as $p){if(is_link($p))throw new RuntimeException("Linked release directory refused");}
 if(realpath($base)!==$base)throw new RuntimeException('Unexpected domain');
 $targets=['codeme-payments-private/config.php','codeme-payments-private/releases/codeme-0.7.0-local-9587d0a573e2.zip'];$before=[];
 foreach($targets as $relative)$before[$relative]=kmHash($base,$relative);
 if(!is_string($before[$targets[0]])||$before[$targets[1]]!==null)throw new RuntimeException('Unexpected maintenance baseline');
 $protected=[];foreach(["public_html/.htaccess", "public_html/index.html", "public_html/index.txt", "public_html/__next.__PAGE__.txt", "public_html/__next._full.txt", "public_html/__next._index.txt", "public_html/__next._tree.txt", "careerlift-payments-private/config.php", "codeme-payments-private/bootstrap.php", "codeme-payments-private/lib/Commerce.php", "codeme-payments-private/check-install.php", "codeme-payments-private/releases/codeme-0.7.0-local-c015749a7d93.zip", "public_html/products/codeme/.htaccess", "public_html/products/codeme/index.html", "public_html/products/codeme/styles.css", "public_html/products/codeme/checkout.mjs", "public_html/products/codeme/assets/codeme-logo.svg", "public_html/products/codeme/assets/codeme-wordmark-light.svg", "public_html/products/codeme/assets/codeme-512.png", "public_html/products/codeme/api/_bootstrap.php", "public_html/products/codeme/api/payments.php", "public_html/products/codeme/api/download.php", "public_html/api/careers-apply.php", "public_html/api/careers-roles.json", "public_html/api/dhebevoice-signup.php", "public_html/api/dhebevoice-smtp.php"] as $relative)$protected[$relative]=kmHash($base,$relative);
 if(!is_dir($work)&&!mkdir($work,0700,true))throw new RuntimeException('Private release directory unavailable');chmod($work,0700);
 $path=$work.'/transfer-key.pem';if(is_link($path))throw new RuntimeException('Linked transfer key refused');
 if(is_file($work.'/complete.json')||is_file($work.'/failed.json'))throw new RuntimeException('Release already attempted');
 if(!is_file($path)){
  $key=openssl_pkey_new(['private_key_type'=>OPENSSL_KEYTYPE_RSA,'private_key_bits'=>3072]);
  if(!$key||!openssl_pkey_export($key,$pem))throw new RuntimeException('Transfer key generation failed');
  $temp=tempnam($work,'key-');
  if($temp===false||file_put_contents($temp,$pem,LOCK_EX)!==strlen($pem)||!chmod($temp,0600)||!rename($temp,$path))throw new RuntimeException('Key persistence failed');
  unset($pem,$key);
 }
 $key=openssl_pkey_get_private(file_get_contents($path));$details=$key?openssl_pkey_get_details($key):false;
 if(!is_array($details)||!isset($details['key']))throw new RuntimeException('Public key unavailable');
 echo json_encode(['ready'=>true,'release'=>'codeme-maintenance-20261031-02','publicKey'=>$details['key'],'publicKeySha256'=>hash('sha256',$details['key']),'before'=>$before,'protected'=>$protected],JSON_THROW_ON_ERROR)."\n";
}catch(Throwable $e){echo json_encode(['ready'=>false,'error'=>$e->getMessage()])."\n";exit(1);}
