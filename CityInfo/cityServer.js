var assert = require('assert');
var express = require("express");
var weather=require('./moduleTemperature');
var resultats = [];
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/public/infoBoard.html');
});

app.get('/findInformations', function (req, res) {
    console.log("J'ai bien récupéré le nom de la ville : "+req.query.cityName);
    weather.getCityInfoMeteo(req.query.cityName,function(body) {
      //  console.log("Température de test : "+JSON.parse(body).main.temp+";");
    res.end(JSON.stringify(body));
  });

  
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});