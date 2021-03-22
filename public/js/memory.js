// console.log = function() {} // à décommenter pour désactiver le mode DEBUG dans la console

// ---- VARIABLES
var cards = {}; // initialisation d'un objet global pour contenir toutes les cartes
var progress; // progression du jeu, 1 paires de cartes trouvées augmente de 1
var countdown; // chronomètre
var timeLeft = 180; // Durée max d'une partie
var clicks; // nombre de click sur une carte quelconque
var firstCard; // stocker la première carte retournée

// Génération du plateau de jeu avec les cartes mélangées
initGame();

// Compte à rebours lancé en début de partie
var countdown = setInterval(function(){
  if(timeLeft <= 0){
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "Perdu !";
    // Temps écoulé, Alert Box avec rechargement de la page
    // Echap rechargera aussi la page
    if(window.alert("Perdu :( Vous ferez mieux la prochaine fois !")){}
    else window.location.reload();
  } else {
    // Affichage du temps restant sous le format 00:00
    document.getElementById("countdown").innerHTML = convertToMinuteSeconds(timeLeft);
  }
  // décrementer le temps restant
  timeLeft -= 1;
}, 1000);

// a décommenter pour tester rapidement l'enregistrement en BD en fin de partie
//win();

// ---- FONCTIONS
// -------------- initialisation du plateau de jeu avec les cartes ---//
function initGame (){
  makeCards(); // génération des 18 cartes
  shuffleFisherYates(cards); // mélange des cartes
  supprim4cards();// retenir seulement 14 cartes pour remplir le plateau de 28 cases
  // TODO: revoir le mélange des 2 séries de cartes
  //facteur aléatoire ok mais 2 séries distinctes sur le plateau
  placeCards(); // placer la première suite de cartes
  shuffleFisherYates(cards);// remélanger
  placeCards(); // placer la deuxième suite de cartes
  initVar(); // ré-initialisation des variables pour une nouvelle partie
}

// ---- LOGIC
// Le jeu démarre lors d'un click sur une carte
// la fonction est asynchrone afin de pouvoir bloquer uniquement cette fonction
// avant de retouner les cartes
async function clickCard() {
  clicks++; // on comptabilise le click
  this.removeEventListener('click', clickCard); // Désactiver les clicks sur la carte

  if (!(clicks % 2 === 0)) { // si le nombre de clicks est impair c'est une "première" carte retournée
    this.classList.remove("hidden"); // Révéler la première carte
    firstCard = this; // Stocker l'objet div de la carte pour comparaison avec la prochaine carte
  }
  else {
    this.classList.remove("hidden"); // Révéler la deuxième carte
    // Comparaison des 2 cartes retournées à l'aide de leurs index
    if (this.dataset.index == firstCard.dataset.index){
      // Paire de cartes trouvée, afficher la progression
      updateProgress();
    }
    else {
      // Mauvaises cartes
      // Désactiver les évenements clicks sur toutes les cartes
      const allCards = document.querySelectorAll("div.card");
      allCards.forEach(element => {
        element.removeEventListener('click', clickCard);
      });
      await new Promise(r => setTimeout(r, 2000)); // Pause de 2 secondes, voir la déclaration de cette fonction
      allCards.forEach(element => {
        element.addEventListener('click', clickCard);
      });
      // Cacher les cartes
      this.classList.add("hidden");
      firstCard.classList.add("hidden");
      // les rendres à nouveau clickables
      this.addEventListener('click', clickCard);
      firstCard.addEventListener('click', clickCard);
    }
  }
}

// Constructeur d'objet JS, à appeler pour générer les différentes cartes
// un objet tableau contiendras tous les objets
function Card(index, bg, state) {
  this.index = index; // id de la carte
  this.bg = bg; // paramètres pour définir le positionnement de l'image en fond
  this.state = state; // permet de changer ou tester si une carte est cachée/card/validée
}

// Génération des cartes
function makeCards() {
  for (var i = 0; i < 18; ++i ) {
    cards[i] = new Card(); // appel du Constucteur d'objets Card
    cards[i].index = i+1; // pour numéroter les carte de 1 à 18 (facultatif)
    cards[i].bg = "0px "+ i*100 + "px"; // positionnement de l'image de fond, décalage de 100 pixels vers le bas
    cards[i].state = "card hidden"; // carte cachée par défaut
  }
  // l'objet cards[] est retourné
}

// Générer les cartes HTMLs et les placer sur la page dans la div conteneur <desk>
function placeCards() {
  // Méthode JS dédiée au parcours des tableaux d'objets
  // l'index de parcours est < key >
  Object.keys(cards).forEach(function(key) {
    let divCard = document.createElement('div'); // création d'un élément HTML <div>
    divCard.dataset.index = cards[key].index; // ajoute d'une propriété html pour stocker l'index de la carte
    divCard.className = cards[key].state; // la classe CSS stockera l'état de la carte (card/cachée/validée)
    divCard.style.backgroundPosition = cards[key].bg; // propriété pour l'image de fond
    divCard.addEventListener('click', clickCard); // Ajout d'évenement click sur la div générée
    // Ajout de la div au document HTML
    document.getElementById("desk").appendChild(divCard);
  })
}

// Mélanger un tableau d'objets à l'aide de l'algo FisherYates
// https://fr.wikipedia.org/wiki/M%C3%A9lange_de_Fisher-Yates
function shuffleFisherYates(array) {
  let i =  Object.keys(cards).length; // équivalent à array.lenght mais pour les tableaux d'objets
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}
// Supprimer 4 cartes du jeu initial
function supprim4cards() {
  for (var i = 14; i < 18; ++i ) {
    delete cards[i];
  }
}
// Réinitialisation des variables en début de partie
function initVar() {
  progress = 0;
  countdown = 0;
  result = null;
  clicks = 0;
  cardscard = null;
}
// Convertir un temps en secondes en minutes:secondes
function convertToMinuteSeconds(t){
  // https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  // solution de GitaarLAB
  return(t-(t%=60))/60+(9<t?':':':0')+t
}
// Gestion de la progression
function updateProgress (){
  progress++
  // barre de progression augmentée de 100 px (div conteneur progress de largeur 800px)
  if (progress <= 14){ // 14 paires de cartes à trouver pour gagner
    document.getElementById("bar").style.width = progress*50+"px"
  }
  if (progress == 14){
    win();
  }
}

// GAGNE - figer le jeu, demander le nom du joeur, enregister en BD via Ajax
function win (){
  // Le chronomètre affiche la partie gagnée
  document.getElementById("countdown").innerHTML = "Gagné !";
  // la variable player va contenir le retour du formulaire (nom du joueur)
  var player = prompt("BRAVO !!! \nVous avez gagné la partie en \n " + timeLeft +"s\n Entrez votre nom :", "Memorisator");

  if (player != null) {
    // Création d'une requette Ajax POST
    var xhttp = new XMLHttpRequest();
    var url = '../Controller/updateScores.php';
    var sendScore = 'player_name='+player+'&player_score='+timeLeft;
    xhttp.open('POST', url, true);
    // renseigner les entêtes de la requette
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // attente de la réponse du serveur avant de recharger la page
    xhttp.onreadystatechange = function() {
      // appelé lors du retour de la requete Ajax
      if (this.readyState == 4 && this.status == 200) {
        // on recharge la page / le jeu
        window.location.reload();
      }
    };
    // Envoie les données au script php
    xhttp.send(sendScore);
  }
  else {
    // la valeur retournée est nulle, on relance le jeu
    window.location.reload();
  }
}
