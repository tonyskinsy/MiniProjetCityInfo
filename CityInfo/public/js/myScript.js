// Valeur par défaut des coordonnées de la google map avant saisie du nom d'une ville
var uluru = { lat: -25.363, lng: 131.044 };
//fonction native de google map nécessaire à la construction d'une google map
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}
// les api gèèrent les accents différemment. Cette fonction permet de les enlever de noms des villes  afin qu'ils soient utilisatbles par toutes les api
function sansAccent(strWithAccent) {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    var str = strWithAccent;
    for (var i = 0; i < accent.length; i++) {
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}
// cette fonction permet de récupérer une chaîne de caractère et de mettre sa première lettre en majuscule
function capitalize(strWNFU) {
    return strWNFU.charAt(0).toUpperCase() + strWNFU.slice(1);
}
//cette fonction va à la recherche des informations wikipédia et a pour paramètre le nom de la ville saisie dans le champ de texte
function getWikiInfo(citi) {
    // appel ajax qui retourne le résultat en objet de type JSON et ensuite du contenu dans une balise ayant l'identifiant "wikinfo
    $.getJSON('http://fr.wikipedia.org/w/api.php?action=parse&page=' + citi + '&prop=text&format=json&callback=?', function (json) {
        $('#wikiInfo').html(json.parse.text['*']);
        $("#wikiInfo").find("a:not(.references a)").attr("href", function () { return "http://www.wikipedia.org" + $(this).attr("href"); });
        $("#wikiInfo").find("a").attr("target", "_blank");
    });
}
//récupération de l'objet json retournée par l'api météo
function readBody(xhr) {
    var data;
    data = JSON.parse(xhr.response);
    return data;
}
//va à la recherche de toutes les informations sur la ville saisie
function getInformations() {
    var wikiResult = new Object();
    var frm = $('#myForm');
    //blocage de l'envoi automatique par défaut du formulaire
    frm.submit(function (e) {
        e.preventDefault();
        //récupération de la chaîne saisie et traitement de celle ci pour la compatibité avec les api
        getWikiInfo(document.getElementById('cityID').value.replace(" ", "_")); // appel de l'api de wikipédia
        var cityName = sansAccent(document.getElementById('cityID').value.replace(" ", "+"));
        console.log("Je vais à la recherche des informations sur la ville de " + cityName);
        //Envoi de la requête ajax au serveur qui la transmettra à l'api météo
        var xhr = new XMLHttpRequest();
        var url = 'findInformations?cityName=' + cityName;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var result = readBody(xhr);
                console.log(result);
                //construction de la page avec les informatiosn récupérées
                constructPage(result);
            }
        }
        xhr.send(null);
    });
}
function constructPage(result) {
    console.log("informations arrivées")
    console.log(typeof result);
    //élément de test de l'existence réelle de l'objet retourné
    console.log("Latitude : " + result.coord.lat);
    console.log("Latitude : " + result.coord.lon);
    //chargement des nouvelles valeurs de coordonnées pour la google map
    uluru = { lat: result.coord.lat, lng: result.coord.lon };
    // création de nouvelles balises et insertion de sdonnées récupérées
    var groupMeteo = document.getElementById('bodyinfoMeteo');
    var enteteInfoMeteo = document.getElementById('enteteInfoMeteo');
    enteteInfoMeteo.innerText = "";
    groupMeteo.innerHTML = "";
    var myHtmlObjectArray = [];
    for (var i = 0; i < 9; i++) {
        var line = document.createElement("a");
        line.href = "#";
        line.className = "list-group-item list-group-item-action disabled";
        myHtmlObjectArray.push(line);
    }
    myHtmlObjectArray[8].className = "list-group-item list-group-item-action";
    for (var i = 0; i < 9; i++) {
        groupMeteo.appendChild(myHtmlObjectArray[i]);
    }
    enteteInfoMeteo.innerText = "Informations sur la météo \n Ville : " + capitalize(result.name) + "\n Pays : " + capitalize(result.sys.country) + "\n Date : " + new Date(result.sys.sunrise * 1000).toLocaleDateString();
    myHtmlObjectArray[0].innerHTML = "Température actuelle : " + (result.main.temp - 273.15) + "°C";
    myHtmlObjectArray[1].innerHTML = "Température min : " + (result.main.temp_min - 273.15) + "°C";
    myHtmlObjectArray[2].innerHTML = "Température max : " + (result.main.temp_max - 273.15) + "°C";
    myHtmlObjectArray[3].innerHTML = "Taux d'humidité : " + result.main.humidity + "%";
    myHtmlObjectArray[4].innerHTML = "Ciel : " + capitalize(result.weather[0].description);
    myHtmlObjectArray[5].innerHTML = "Vitesse du vent (en mètres par seconde) : " + result.wind.speed;
    myHtmlObjectArray[6].innerHTML = "Heure de levée du soleil : " + (new Date(result.sys.sunrise * 1000)).toLocaleTimeString();
    myHtmlObjectArray[7].innerHTML = "Heure de couchée du soleil : " + (new Date(result.sys.sunset * 1000)).toLocaleTimeString();
    myHtmlObjectArray[8].innerHTML = "Plus dinfos";
    myHtmlObjectArray[8].href = "http://openweathermap.org/city/" + result.id + "?utm_source=openweathermap&utm_medium=widget&utm_campaign=html_old\" target=\"_blank\"";
    //réinitialisation de la google map
    initMap();
    citi = result.name;

}
