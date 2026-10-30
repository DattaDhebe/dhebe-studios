if(PHP_SAPI!=="cli")exit(1);
ini_set("display_errors","0");ini_set("log_errors","0");umask(0077);
$base="/home/u942725982/domains/dhebe.com";
$work=$base."/private/site-releases/codeme-product-20261031";
try{
 foreach([$base,$base."/private",$base."/private/site-releases",$work] as $p){if(is_link($p))throw new RuntimeException("Linked release directory refused");}
 if(!is_dir($work)&&!mkdir($work,0700,true))throw new RuntimeException("Private release directory unavailable");
 chmod($work,0700);
 $path=$work."/transfer-key.pem";
 if(is_link($path))throw new RuntimeException("Linked transfer key refused");
 if(!is_file($path)){
  $key=openssl_pkey_new(["private_key_type"=>OPENSSL_KEYTYPE_RSA,"private_key_bits"=>3072]);
  if(!$key||!openssl_pkey_export($key,$pem))throw new RuntimeException("Transfer key generation failed");
  $temp=tempnam($work,"key-");
  if($temp===false||file_put_contents($temp,$pem,LOCK_EX)!==strlen($pem)||!chmod($temp,0600)||!rename($temp,$path))throw new RuntimeException("Transfer key persistence failed");
  unset($pem,$key);
 }
 $key=openssl_pkey_get_private(file_get_contents($path));$details=$key?openssl_pkey_get_details($key):false;
 if(!is_array($details)||!isset($details["key"]))throw new RuntimeException("Transfer public key unavailable");
 $connection=["fileExists"=>false,"enabled"=>false,"mode"=>null,"keysPresent"=>false];
 $file=$base."/careerlift-payments-private/config.php";
 if(is_file($file)&&!is_link($file)){
  $settings=require $file;
  if(is_array($settings))$connection=["fileExists"=>true,"enabled"=>in_array($settings["enabled"]??false,[true,"1","true"],true),"mode"=>in_array($settings["mode"]??null,["production","sandbox"],true)?$settings["mode"]:null,"keysPresent"=>is_string($settings["client_id"]??null)&&strlen($settings["client_id"])>=8&&is_string($settings["client_secret"]??null)&&strlen($settings["client_secret"])>=8];
  unset($settings);
 }
 echo json_encode(["ready"=>true,"publicKey"=>$details["key"],"publicKeySha256"=>hash("sha256",$details["key"]),"connection"=>$connection],JSON_THROW_ON_ERROR)."\n";
}catch(Throwable $e){echo json_encode(["ready"=>false,"error"=>$e->getMessage()])."\n";exit(1);}
