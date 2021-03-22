<?php
// ---- Connection à la BD
// Informations de connection
$host = "localhost"; // nom du serveur de BD
$db = 'memory'; // nom de la BD
$db_username = "www-data";
$db_passwd = "www-data";
$DB = null; // Stocker la connection à la BD

try {
  // Création de l'objet de connection à la BD
  // en activant les retours d'erreurs MySQL
	$DB = new PDO("mysql:host=$host;dbname=$db", $db_username, $db_passwd,
   array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
  } catch (Exception $ex) {echo $ex->getMessage();}

?>
