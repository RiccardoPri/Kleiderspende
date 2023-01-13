/*********************************************************************************
JS for: Studienarbeit Programmierung von Webanwendungsoberflächen
Description: Fiktive Vereinsseite für zur Registrierung von Kleiderspenden

Version: 1.0
Author: Riccardo Princiotto
License: none
Tags: Javascript, Ajax, jQuery, responsiv, data from json, bootstrap

Notices: using jQuery functionality, to request json files and fill the 
        finish.html with data from two different json files
**********************************************************************************/
/************ function for loading a json file ***********/
function loadJSON(file,callback) {   
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType('application/json');
	xobj.open('GET', file, true); 
	xobj.onreadystatechange = function () {
	  if (xobj.readyState == 4 && xobj.status == '200') {
	  // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
		callback(xobj.responseText);
	   }
	};
	xobj.send(null);  
  }

/************ Fill the document on document ready function ***********/
$(document).ready(function () {
/************ get the tablename via cookie ("donation"+id) ***********/
    let tablename = document.cookie;
/************ get the id from tablename string ***********/
    let id = tablename[tablename.length -1];
/************ declare variables for text massage ***********/
    let textBringOrCollect;
    let cityTextValue;
    let finishLocationString;
    let location;
    let locationToBring;
    let collect;
    let timestamp;
    let timestampString;
    let date;
    let time;
    let headlinetime;
/************ request json file with personal data ***********/
    let requestURLpd = "../php/json/PersonalDataID"+id+".json";
    loadJSON(requestURLpd, function(text){
        let data = JSON.parse(text);
        let name = data[0].name;
        $("#nameJson").html(name);
        let surname = data[0].surname;
        $("#surnameJson").html(surname);
        let email = data[0].email;
        $("#emailJson").html(email);
        let birthday = data[0].birthday;
        $("#birthdayJson").html(birthday);


/************ get optional data like street (if the first is empty hide these tabel) ***********/
        let street = data[0].street;
        let housenumber = data[0].housenumber;
        let zip = data[0].zip;
        let city = data[0].city;
        location = data[0].ourlocation;
        locationToBring = data[0].toLocation;

        if(street == "" || housenumber == "" || zip == "0" || city == "") {
            $("#tablePersonalData2").hide();
            textBringOrCollect = "Du bringst uns Deine Spende zu unserer Geschäftstelle in "
        } else {
            $("#streetJson").html(street);
            $("#housenumberJson").html(housenumber);
            $("#zipJson").html(zip);
            $("#cityJson").html(city);
            textBringOrCollect = "Wir holen deine Spende bei Dir ab "
            collect = true;
        }
/************ get timestamp from donation finish ***********/
        timestamp = data[0].timestamp;
        timestampString = timestamp.toString();
/************ get the date and time from the timestamp ***********/  
        date = timestampString.slice(0, 10);
        time = timestampString.slice(11, 19);
        
/************ Value from dropdown outLocation to Cityname ***********/
        switch (location) {
            case "10":
                cityTextValue = "Berlin";
                break;
            case "20":
                cityTextValue = "Hamburg";
                break;
            case "44":
                cityTextValue = "Dortmund";
                break;
            case "60":
                cityTextValue = "Frankfurt am Main"
                break;
            case "80":
                cityTextValue = "München"
                break;
        }
/************ set text for headline h2 ***********/
        headlinetime = "Deine Daten vom " + date + " um " + time + " Uhr:";
        $("#h2-1").html(headlinetime);

/************ set text for finishLocation p-Tag ***********/
            if (collect == true) {
                finishLocationString = textBringOrCollect + "und bringen sie in Krisengebiet Nr. " + locationToBring;
            } else {
                finishLocationString = textBringOrCollect + cityTextValue + " und wir bringen sie in Krisengebiet Nr. " + locationToBring;
            }
            $("#finishLocation").html(finishLocationString);    
                
    })

/************ request json file with donation data ***********/
    let requestURL = "../php/json/"+tablename+"Summery.json";
    loadJSON(requestURL, function(text) {
        let data = JSON.parse(text);
/************ create a table item for every donation item in json ***********/        
        for (let i=0; i<data.length; i++) {
            let innerhtml = "<tr><td>"+data[i].id + "</td>" + "<td>"+data[i].forWho + "</td>" + "<td>"+data[i].category + "</td>" + "<td>"+data[i].size + "</td>" + "<td>"+data[i].color + "</td></tr>";
            $("#summery").append(innerhtml);
          }
          
    });

/************ geolocate City Date if not input user city ***********/ 

function getCoordintes() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
  
    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
        return;
  
    }
  
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];
    
    console.log(lat);
    console.log(lng);

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.ed945b62c3304a249d198ef1ed8786aa&lat=" + lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);
  
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var responseString = response.display_name;
            const adressArr = responseString.split(', ');
            let city = adressArr[3];
            console.log(city);
            return;
        }
    }
}
  
getCoordintes();

    
});