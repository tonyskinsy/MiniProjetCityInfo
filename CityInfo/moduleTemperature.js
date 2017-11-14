//var city = "New+York";
var http = require("http");

function printMessage(city, temperature, pressure) {
    console.log("A " + city + ", la température est de " + (temperature - 273.15) + "°C et la pression est de " + pressure + " pascals");
}
function getCityInfoMeteo(city, callback) {
    var request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=49495a854750288931f40fc3082d7c84", function (response) {
        var body = "";
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            console.log("Elément retourné :" + body);
            if (response.statusCode === 200) {
                try {
                    var data_weather = JSON.parse(body);
                    printMessage(city, data_weather.main.temp, data_weather.main.pressure);
                    console.log("Coordonnées : "+data_weather.coord.lat)
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

module.exports.getCityInfoMeteo = getCityInfoMeteo;