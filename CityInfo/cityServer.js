/* Définition du Serveur sur lequel toute l'application*/
var assert = require('assert');
var express = require("express");
//Importation du module température qui a  été séparé du code du serveur afin de le rendre plus lisible
var weather = require('./moduleTemperature');
// utilisation du module express voir : http://expressjs.com/fr/ 
var app = express();
app.use(express.static('public'));
//définition d ela page par défaut/principale lors du lancement de l'application sur le serveur et louverture sur le port défini
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/infoBoard.html');
});
//url qui permet la redirection ou le traitement lors de l'envoi d'une requête. Le serveur compare le contenu de la reqûete avec l'ensemble des get et exécute la fonction de callback de l'url correspondant
app.get('/findInformations', function (req, res) {
  // l'objet req contient les attributs de la requête ajax envoyée au serveur via l'url. Dans le cas d'espèce, on récupère le paramètre cityName envoyé pa myScript.js via infoBoard.html
  console.log("J'ai bien récupéré le nom de la ville : " + req.query.cityName);
  //Appel de la méthode getCityInfoMeteo via la variable weather qui contient l'appel du module moduleTemperature
  weather.getCityInfoMeteo(req.query.cityName, function (body) {
    //  console.log("Température de test : "+JSON.parse(body).main.temp+";");
    res.end(body);
  });
});
//définition du port d'écoute du serveur
app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});