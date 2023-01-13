/*********************************************************************************
JS for: Studienarbeit Programmierung von Webanwendungsoberflächen
Description: Fiktive Vereinsseite für zur Registrierung von Kleiderspenden

Version: 1.0
Author: Riccardo Princiotto
License: none
Tags: Javascript, Ajax, jQuery, responsiv, animation, data validation

Notices: using jQuery functionality, ajax posts to external php file, Data storage
            on a mysql
**********************************************************************************/

/********************************************************************************
                            Defining global variables
*********************************************************************************/

var section5Hidden = false;
var section4Hidden = false;
var section2Hidden = false;
var section3Hidden = false;
var imgActive;
var collectTrue;
var name;
var surname;
var eMail;
var dateOfBirth;
var street;
var houseNumber;
var zipCode;
var city;
var office;
var destination;
var numberArticle = 1;
var tablename = localStorage.tablename;
var jsonArray;
var locationOfUser;


/********************************************************************************
                        Functionality on document loaded
*********************************************************************************/

$(document).ready(function(){
	//hiding content for later animation
	$("#section5").hide();	
	$("#section4").hide();	
	$("#header").hide();
	$("#personalDataDependence").hide();
	$("#section3Donation").hide();
	//setting global variables
	section5Hidden = true;
	section4Hidden = true;
	section3Hidden = true;
	imgActive =	$("#contentS3").find(".CarouselItemActive").attr("id");
	var windowSize = ($(window).width() );
	if(windowSize <=974) {
		$("#navStart, #logoStart").hide();
		$("#header").show();
	}
});

/********************************************************************************
                    Embedded navigation hide on scroll function
*********************************************************************************/

//This has to be deactivated on @Media < 974px
//This functions is active on every scroll on the page
    $(window).scroll(function() {
		//define variables for this function
        var yPos = ( $(window).scrollTop() );
		var windowSize = ($(window).width() );
		if(windowSize > 974) { //only works if windowSize is > 974px
			if(yPos < 1) { // starts after scrolling one px
				//on 0px scroll the embedded navigation fadeIn and the navbar fade out
				$("#navStart, #logoStart").fadeIn();
				$("#header").fadeOut();
			} else {
				//it turns after 1px was scrolled
				$("#navStart, #logoStart").fadeOut();
				$("#header").fadeIn();
			}
		}
	});

/********************************************************************************
                    Funcionaltity for index.html
*********************************************************************************/
/********* image carousel ***********/
/********* function next image and discription text***********/
function nextImage () {
	if (imgActive === "imgCarousel1") {
		$("#imgCarousel1, #imgDiscription1").fadeOut(function(){
			$("#imgCarousel2, #imgDiscription2").fadeIn();
			imgActive = "imgCarousel2";
		});
	} else if (imgActive === "imgCarousel2") {
		$("#imgCarousel2, #imgDiscription2").fadeOut(function(){
			$("#imgCarousel3, #imgDiscription3").fadeIn();
			imgActive = "imgCarousel3";
		});
	} else if (imgActive === "imgCarousel3") {
		$("#imgCarousel3, #imgDiscription3").fadeOut(function(){
			$("#imgCarousel1, #imgDiscription1").fadeIn();
			imgActive = "imgCarousel1";
		});
	};
};

/********* function last image and discription text***********/
function prevImage () {
	if (imgActive === "imgCarousel1") {
		$("#imgCarousel1, #imgDiscription1").fadeOut(function(){
			$("#imgCarousel3, #imgDiscription3").fadeIn();
			imgActive = "imgCarousel3";
		});
	} else if (imgActive === "imgCarousel2") {
		$("#imgCarousel2, #imgDiscription2").fadeOut(function(){
			$("#imgCarousel1, #imgDiscription1").fadeIn();
			imgActive = "imgCarousel1";
		});
	} else if (imgActive === "imgCarousel3") {
		$("#imgCarousel3, #imgDiscription3").fadeOut(function(){
			$("#imgCarousel2, #imgDiscription2").fadeIn();
			imgActive = "imgCarousel2";
		});
	};
};


/********* call on button click functions ***********/
/********* last image ***********/
$("#prev").click(function () { 
	prevImage();
});
/********* next image ***********/
$("#next").click(function () { 
	nextImage();
});
/********* Click on image calls next image ***********/
 $(".imgCarousel").click(function(){
	nextImage();
 });

/********************************************************************************
                    Funcionaltity for about.html
*********************************************************************************/

/********************************************************************************
                    Funcionaltity for spenden.html
*********************************************************************************/ 

/********Text fade in or out with radio button choice ************
 ******** Form fields depents on the radio choose ****************/  

$("#bring, #collect").change(function(){
	if (this.value == "bring") {
		$("#collect").prop("checked", false);
		$("#personalDataDependence").fadeOut();		
		$("#pCollect").fadeOut(function(){
			$("#pBring").fadeIn();
			collectTrue = false;
		});
	} else {
		$("#bring").prop("checked", false);
		$("#personalDataDependence").fadeIn();		
		$("#pBring").fadeOut(function(){
			$("#pCollect").fadeIn();	
			collectTrue = true;	
		});		
	}
});

/******** Submit personal data on button click *****************
 ******** first data check if data are plausible ****************/ 

$("#submitPersonalData").click(function () { 
	//Values of all fields to variables
	var locationToBring = $("#location").val();	
	var name = $("#nameInput").val();
	var surname = $("#surnameInput").val();
	var email = $("#emailInput").val();
	var birthday = $("#birthdayInput").val();
	var street = $("#streetInput").val();
	var houseNumber = $("#houseNumerInput").val();
	var zip = $("#zipInput").val();
	var city = $("#cityInput").val();
	var sendToLocation = $("#sendToLocation").val();

/********** Data check for name, surname, email  *********/

/******** check name only name typical characters and a min of 2 and max of 20 **********/
		var testName = /^[A-Z-`'\ ]{2,20}$/i;
		if (testName.test(name)) {
			console.log("name check status ok");
		} else {
			alert("Dein Name darf nur Buchstaben, Leerzeichen und Apostroph enthalten und muss mindestens 2 stellen lang sein");
			return false;
		}

/******** check name only name typical characters and a min of 2 and max of 20 **********/
		var testSurName = /^[A-Z-`'\ ]{2,20}$/i;
		if (testSurName.test(surname)) {
			console.log("surname check status ok");
		} else {
			alert("Dein Nachname darf nur Buchstaben, Leerzeichen und Apostroph enthalten und muss mindestens 2 stellen lang sein");
			return false;
		}

/******** check if email is plausible (has an @ and after a . for domain) no ***********
 ********************************** script tags possible ******************************/
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,6}$/i;
		if (testEmail.test(email)) {
			console.log("email validation status ok");
		} else {
			alert("Bitte überprüfe Deine e-Mail Adresse!");
			return false;
		}

/********check value of radio bring and collect if true, do the zip check***********/
	if (collectTrue == true) {

/********** Data check for street, housenumber, zip and city *********/
/******** check value of field street **********/
		var testStreet = /^[A-Z0-9-ßäüö`'\ ]{2,50}$/i;
		if (testStreet.test(street)) {
			console.log("street check status ok");
		} else {
			alert("Invalide Eingabe des Straßennamens. Bitte prüfe deine Eingabe!");
			return false;
		}

/******** check value of field housenumber **********/
		var testHouseNumber = /^[A-Z0-9-\ ]{1,6}$/i;
		if (testHouseNumber.test(houseNumber)) {
			console.log("Housenumber check status ok");
		} else {
			alert("Invalide Eingabe der Hausnummer. Bitte prüfe deine Eingabe!");
			return false;
		}

/******** check value of zip field (only numbers 3 to 5 letters) **********/
		var testZip = /^[0-9]{3,5}$/i;
		if (testZip.test(zip)) {
			console.log("zip check status ok");
		} else {
			alert("Invalide Eingabe der Postleitzahl. Bitte prüfe deine Eingabe!");
			return false;
		}

/******** check value of field city **********/
		var testCity = /^[A-Z0-9-ßäüö`'\ ]{2,50}$/i;
		if (testCity.test(city)) {
			console.log("city check status ok");
		} else {
			alert("Invalide Eingabe der Stadt. Bitte prüfe deine Eingabe!");
			return false;
		}

/********check if other inputs has a value***********/
		if (locationToBring == null || birthday == "" || sendToLocation == null) {
			alert("Bitte vervollständige deine Angaben!");
			return false;
		} else {
/********** check ZIP Code. Get first two characters of user zip and check with dropdown value *******/
			var checkzip = zip.slice(0, 2);
			if (checkzip != locationToBring) {
				alert("Du befindest dich nicht im selben Postleitzahlgebiet. Eine Abholung ist nicht möglich");
				return false;
			} else {
				console.log("zip check for location ok");
				//prepare sending information
			} }
	} else if (collectTrue == false){

/********check if other inputs had a value***********/
		if (locationToBring == null || birthday == "" || sendToLocation == null) {
			alert("Bitte vervollständige deine Angaben!");
			return false;
		}
			//prepare sending information
	} else {
		alert("Bitte vervollständige deine Angaben!")
		return false;
	}
/*********** send ajax to geolocation db ***********/
		$.ajax({
			url: "https://geolocation-db.com/jsonp",
			jsonpCallback: "callback",
			dataType: "jsonp",
			success: function(location) {
			locationOfUser = location.city;
			alert(locationOfUser);
			}
		});	
		
/***********data send to php file personalData via post method ***********/
	$.ajax({
		type: "post",
		url: "../php/personalData.php",
		data: {
			personalData: 1,
			locationPHP: locationToBring,
			namePHP: name,
			surnamePHP: surname,
			emailPHP: email,
			birthPHP: birthday,
			streetPHP: street,
			houseNumberPHP: houseNumber,
			zipPHP: zip,
			cityPHP: city,
			toLocationPHP: sendToLocation,
		},
		success: function (response) {
			tablename=(response);
			console.log(tablename);
			document.cookie = tablename;
		}
	});

/***************if everything works, hide these section and fadeIn next **********/
		if(section3Hidden == true) {
			$("#massageS3Donation").append("Danke " + name + ", Du kannst jetzt deine Spende registrieren.");
			$("#section3Donation").fadeIn();
			section3Hidden = false;
		}
		if (section4Hidden == true) {
			$("#section4").fadeIn();
			section4Hidden = false;
		}
		$("#section2").fadeOut();
		section2Hidden = true;	
});

/************Fill in the value of dropdown size on change************
 ******** dropdown forWho and Category with corresponding values ****************/ 

$(".dropdown").change(function () { 
/***************read values of forWho and category and safe in new var **********/
	var forWhoVal = $("#forWho").val(); 	
	var categoryVal = $("#category").val();

/***************check if forWho choice is boys or girls and category is not shoes **********/
	if ((forWhoVal <= 2) && (forWhoVal != null) && (categoryVal <=4) && (categoryVal != null)) {
		$("#size").removeAttr("disabled");			//enable dropdown size
		$("#size").find("option").remove();			//remove all options
		$("#size").append("<option value='' disabled selected hidden>Größe:</option>");		//disable usable headline
		
		var arr1 = [56, 68, 86, 92, 98, 104, 110, 116, 128, 134, 140, 146, 152, 158, 164, 170]; //array of children sizes
		$.each(arr1, function (index, value) { 
			 $("#size").append($("<option>").text(value).attr("value", index));		//for every element of the array create an option Tag
		});
	} else

/***************check if forWho choice is boys or girls and category is shoes **********/
	if ((forWhoVal <= 2) && (forWhoVal != null) && (categoryVal == 5)) {
		$("#size").removeAttr("disabled");
		$("#size").find("option").remove();
		$("#size").append("<option value='' disabled selected hidden>Größe:</option>");
		
		var arr1 = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
		$.each(arr1, function (index, value) { 
			 $("#size").append($("<option>").text(value).attr("value", index));
		});
	} else

/***************check if forWho choice is women or men and category is not shoes **********/
	if ((forWhoVal > 2) && (forWhoVal < 5) && (categoryVal <=4) && (categoryVal != null)) {
		$("#size").removeAttr("disabled");
		$("#size").find("option").remove();
		$("#size").append("<option value='' disabled selected hidden>Größe:</option>");
		
		var arr1 = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
		$.each(arr1, function (index, value) { 
			$("#size").append($("<option>").text(value).attr("value", index));
		});
	} else	

/***************check if forWho choice is women or men and category is shoes **********/
	if ((forWhoVal > 2) && (forWhoVal < 5) && (categoryVal == 5)) {
		$("#size").removeAttr("disabled");
		$("#size").find("option").remove();
		$("#size").append("<option value='' disabled selected hidden>Größe:</option>");
		
		var arr1 = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
		$.each(arr1, function (index, value) { 
			$("#size").append($("<option>").text(value).attr("value", index));
		});
	} 
});

/************ Add a new piece to donation list by click addNew button************
 ******** works only if all dropdowns used and have a value not null ****************/ 

$("#addNew").click(function () { 

/***********read data from these four dropdowns and safe to variables as string**********/
 
 var forWho = $("#forWho :selected").text(); 		
 var category = $("#category :selected").text();
 var size = $("#size :selected").text();
 var color = $("#color :selected").text();

/*********** check if every dropdown has a valid value (not null) **********/
 var forWhoVal = $("#forWho").val();
 var categoryVal = $("#category").val();
 var colorVal = $("#color").val();
 var sizeVal = $("#size").val();

	 if ((forWhoVal == null || categoryVal == null || colorVal == null || sizeVal == null)){
		alert("Bitte Angaben vervollständigen")
		return false;
	};

/*********** if data check ok, and it is the first piece, fade in section 5 **********/
	if (section5Hidden == true){
		$("#section5").fadeIn();
		section5Hidden = false;
	};

/*********** check current quantity of rows in section 5 and add one **********/	
	var rows = $(":root").css("--row-quantity");
	rows ++;
	$(":root").css("--row-quantity", rows);

/*********** add data in new row in section 5 **********/	
	var idNew = $(":root").css("--class-id");	//read css variable id
 	idNew ++;									//raise css variable id by one
 	var idCol = 1;
 	$(":root").css("--class-id", idNew);		//give css variable new id
 	var divId = "articleNew" + idNew;			//variable id generating for any piece of donation
 
	$(".articleNew").append("<div id=" + divId	+ idCol + "></div>" );		//add new div with this id
	$("#" + divId + idCol).css({"grid-row": rows,
						"grid-colum": idCol});							//positioning div in css grid
	$("#" + divId + idCol).html(numberArticle).hide().slideDown(1000);	//give text to this div
	idCol ++;															//go to next column

 /*********** insert data from dropdown for who **********/	
	$(".articleNew").append("<div id=" + divId	+ idCol + "></div>" );		
	$("#" + divId + idCol).css({"grid-row": rows,
						"grid-colum": idCol});								
	$("#" + divId + idCol).html(forWho).hide().slideDown(1000);			
	idCol ++;

/*********** insert data from dropdown category **********/	
	$(".articleNew").append("<div id=" + divId	+ idCol + "></div>" );		
	$("#" + divId + idCol).css({"grid-row": rows,
						"grid-colum": idCol});								
	$("#" + divId + idCol).html(category).hide().slideDown(1000);	
 idCol ++;

/*********** insert data from dropdown size **********/	
	$(".articleNew").append("<div id=" + divId	+ idCol + "></div>" );		
	$("#" + divId + idCol).css({"grid-row": rows,
						"grid-colum": idCol});								
	$("#" + divId + idCol).html(size).hide().slideDown(1000);	
	idCol ++;

/*********** insert data from dropdown color **********/	
	$(".articleNew").append("<div id=" + divId	+ idCol + "></div>" );		
	$("#" + divId + idCol).css({"grid-row": rows,
						"grid-colum": idCol});								
	$("#" + divId + idCol).html(color).hide().slideDown(1000);	

/*********** send data to php file donation.php with post method**********/	
	$.ajax({
		type: "post",
		url: "../php/donation.php",
		data: {
			donation: 1,
			forWhoPHP: forWho,
			categoryPHP: category,
			sizePHP: size,
			colorPHP: color,
			tablePHP: tablename,
		},
		success: function (response) {
			console.log(response);
		}
	});

/*********** if everything works, reset the four dropdowns to be ready for next **********/	
  $("#forWho").prop("selectedIndex", 0); 	
  $("#category").prop("selectedIndex", 0);
  $("#size").prop("selectedIndex", 0);
  $("#size").append("<option value='' disabled selected hidden>Größe:</option>");
  $("#size").attr("disabled", "disabled");
  $("#color").prop("selectedIndex", 0);

  	numberArticle ++;		//+1 global variable numberArticle
});

/************ After finish registration and click the finish button************
 ******** call to tojson.php and open finish.html in new tab ****************/ 

$("#finishDonation").click(function () { 
	//sending data to tojson.php to create json file from table with tablename
	$.ajax({
		type: "post",
		url: "../php/tojson.php",
		data: {
			checkout: 1,
			tablePHP: tablename,
		},
		success: function (response) {
			console.log(response);
			window.open("../files/finish.html", "_blank");
		}
	});	
});

/********************************************************************************
                    Funcionaltity for blog.html
*********************************************************************************/ 

/********************************************************************************
                    Funcionaltity for faq.html
*********************************************************************************/ 
/******************** Accordion **************************/
$( function() {
    $( ".accordion" ).accordion({
      collapsible: true
    });
  } );