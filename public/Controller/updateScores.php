<?php
include_once 'connectBD.php';

if($DB){ // test si la connection à la BD est effectué
  // récupérer les variables $_POST[] envoyées par la requette Ajax
  $player_score = $_POST['player_score'];
  // pour la saisie du nom du joueur ne garder que les caractères alphanumériques
  $player_name = preg_replace("/[^A-Za-z0-9[:space:]]/","",$_POST['player_name']);

  // préparation de la requette
  $req = $DB->prepare('INSERT INTO scores (player_name, player_score) VALUES(?, ?)');
  // écriture des données
  $req->execute(array($player_name, $player_score));
}

?>
