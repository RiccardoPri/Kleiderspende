<?php

/*********************************************************************************
PHP donation for: Studienarbeit Programmierung von Webanwendungsoberflächen
Description: Fiktive Vereinsseite für zur Registrierung von Kleiderspenden
Version: 1.0
Author: Riccardo Princiotto
License: none
Tags: PHP, Ajax, mysql, json
Notices: this php-file get the information for donation via ajax send. 
Store the donation data in an individual table.
**********************************************************************************/

if (isset($_POST['donation'])) {
    /************ connection to database with user and reduced rights ***********/
    $connection = new mysqli('localhost', 'user', '8]RWm[qpSkW_(x?', 'kleiderspende');
    //on error with connection
    if (mysqli_connect_error()) {
        die("Verbindungsfehler zur Datenbank");
    }

    /****************get the post variables from jquery ajax send*****************/
    $forWho = $connection->real_escape_string($_POST['forWhoPHP']);
    $category = $connection->real_escape_string($_POST['categoryPHP']);
    $size = $connection->real_escape_string($_POST['sizePHP']);
    $color = $connection->real_escape_string($_POST['colorPHP']);
    $table = $connection->real_escape_string($_POST['tablePHP']);

    //convert POST from tablePHP to string
    $tablename = strval($table);


    /************** prepare to store data in db *******************/
    $donation = $connection->prepare("INSERT INTO $tablename (`forWho`, `category`, `size`, `color`) VALUES (?,?,?,?)");
    /************** execute to store data in db *******************/
    $donation->execute(array($forWho, $category, $size, $color));

    /******* check if it works, look after an id with the sended values ***********/
    $donationAfter = $connection->query("SELECT id FROM $tablename WHERE forWho='$forWho' AND category='$category' AND size='$size' AND color='$color'");
    /************* if it works, massage for console log ******************/
    if ($donationAfter->num_rows > 0) {
        $connection->close();
        exit('donation added');
    } else {
        $connection->close();
        exit('failed to add donation');
    }
}

?>