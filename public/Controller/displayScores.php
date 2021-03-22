<?php
function displayScores(){
  GLOBAL $DB; // utiliser $DB en variable globale
  $textScores = '----- Hall of Fame -----\n'; // stocker la liste des scores en plain_text

      if($DB){ // test si la connection à la BD est effectué
        // récupérer les 10 meilleurs scores
        $req = $DB->prepare("SELECT * FROM scores ORDER BY player_score DESC LIMIT 0,10");
        $req->execute();
        // Objet intermédiaire contenant 1 enregistrement à la fois
        $result = $req->fetchAll();

        if($result){
          foreach ($result as $player) { // parcours de tous les enregistrements
            // concaténation de la chaine de caractères, joueur par joueur
            $textScores = $textScores.' '.$player['player_name'].' : '.$player['player_score'].'\n';
          }
        }
        else{echo "Pas de résultat trouvé";} // jeux trop fat, aucun score !
      }

      // LA BD est partie en vacances
      else{
        echo "Pas de connection BD."; // 
      }
  // la fonction étant appellée à partir de javascript
  // echo renverras la chaine de caractère à l'alert.box
  echo $textScores;
}
 ?>
