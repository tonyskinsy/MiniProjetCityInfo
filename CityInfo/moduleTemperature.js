//appel du module http afin de pouvoir traiter les requêtes du même type. Voir :https://nodejs.org/api/http.html
var http = require("http");

//function d'affichage des données retournées par la console invite de comandes
function printMessage(city, temperature, pressure) {
    console.log("A " + city + ", la température est de " + (temperature - 273.15) + "°C et la pression est de " + pressure + " pascals");
}
function getCityInfoMeteo(city, callback) {
    //envoi de la requête à l'api en insérant da sla requête le nom de la ville
    var request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&lang=fr&appid=49495a854750288931f40fc3082d7c84", function (response) {
        var body = "";
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            console.log("Elément retourné :" + body);
            if (response.statusCode === 200) {
                try {
                    //conversion du résultat en objet json
                    var data_weather = JSON.parse(body);
                    printMessage(city, data_weather.main.temp, data_weather.main.pressure);
                    console.log("Coordonnées : " + data_weather.coord.lat)
                    //envoi du résultat via la fonction de callback
                    callback(body);
                } catch (error) {
                    console.error(error.message);
                }
            }
            else {
                console.error("La ville saisie est inconnue. Veuillez vérifier votre saisie!")
            }

        });
    });
    request.on('error', function (error) {
        console.error(error.message);
    });
}
//définition des méthodes auxquelles l'on peut faire appel lorsque ce module est exporté. Exemple dans cityServer.js
module.exports.getCityInfoMeteo = getCityInfoMeteo;