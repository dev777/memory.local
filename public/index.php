<?php
include_once 'Controller/connectBD.php';
include_once 'Controller/displayScores.php';

?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>
      Memory
    </title>
    <!-- Styles et polices -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Mouse+Memoirs&display=swap" rel="stylesheet">
  </head>

  <body>
    <h1>Jeu de carte Memory</h1>

    <!-- Conteneur global de l'application -->
    <div id="main">
      <div id="desk"></div><!-- contient les cartes pendant la partie-->
      <div id="progress"> <!-- affichage de la progression du joueur et du compteur de temps -->
        <div id="bar"></div>
        <div id="countdown"></div>
      </div>
      <div id="scores">
      </div>
    </div>
  </body>
</html>

<script type="text/javascript">alert("<?php echo displayScores()?>");</script>
<script src="js/memory.js"></script>
