<?php

/*********************************************************************************
PHP personalData for: Studienarbeit Programmierung von Webanwendungsoberflächen
Description: Fiktive Vereinsseite für zur Registrierung von Kleiderspenden
Version: 1.0
Author: Riccardo Princiotto
License: none
Tags: PHP, Ajax, mysql, json
Notices: this php-file get the personaldata via ajax send and insert it to db
and create a json file with the personal data
**********************************************************************************/

if (isset($_POST['personalData'])) {
    /************ connection to database with user and reduced rights ***********/
    $connection = new mysqli('localhost', 'user', '8]RWm[qpSkW_(x?', 'kleiderspende');
    //on error with connection
    if (mysqli_connect_error()) {
        die("Verbindungsfehler zur Datenbank");
    }
    /****************get the post variables from jquery ajax send*****************/
    $name = $connection->real_escape_string($_POST['namePHP']);
    $surname = $connection->real_escape_string($_POST['surnamePHP']);
    $location = $connection->real_escape_string($_POST['locationPHP']);
    $email = $connection->real_escape_string($_POST['emailPHP']);
    $birthday = $connection->real_escape_string($_POST['birthPHP']);
    $street = $connection->real_escape_string($_POST['streetPHP']);
    $houseNumber = $connection->real_escape_string($_POST['houseNumberPHP']);
    $zip = $connection->real_escape_string($_POST['zipPHP']);
    $city = $connection->real_escape_string($_POST['cityPHP']);
    $toLocation = $connection->real_escape_string($_POST['toLocationPHP']);
    /****************get timestamp*****************/
    $datetime = date('Y-m-d H:i:s a', time());

    /************** prepare to store data in db *******************/
    $personalDataReg = $connection->prepare("INSERT INTO `personaldata` (`name`, `surname`, `email`, `birthday`, `street`, `housenumber`, `zip`, `city`, `ourlocation`, `toLocation`, `timestamp`) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    /************** execute to store data in db *******************/
    $personalDataReg->execute(array($name, $surname, $email, $birthday, $street, $houseNumber, $zip, $city, $location, $toLocation, $datetime));
    /******* check if it works, look after an id with the name and timestamp ***********/
    $personalDataAfter = $connection->query("SELECT id FROM personaldata WHERE name='$name' AND timestamp='$datetime'");
    /******* get this id for donation table name before creating ***********/
    $thisID = mysqli_fetch_column($personalDataAfter);
    /******* convert int from thisID to string ***********/
    $thisIDString = strval($thisID);
    /******* tablename is donation + id of the person ***********/
    $tablename = "donation" . $thisIDString;

    //create this table
    $query = "CREATE TABLE $tablename LIKE donationtemplate";
    mysqli_query($connection, $query);

    /************* get the personal Data to json file ******************/
    $jsonFile = "json/PersonalDataID" . $thisIDString . ".json";
    $sql = "SELECT * FROM `personaldata` WHERE id='$thisID'";

    $result = mysqli_query($connection, $sql);

    $json_array = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $json_array[] = $row;
    }
    file_put_contents($jsonFile, json_encode($json_array));

    /************* if it works, get tablename as massage ******************/
    if ($personalDataAfter->num_rows > 0) {
        $connection->close();
        exit($tablename);
    } else {
        $connection->close();
        exit('failed to insert personal data to database');
    }
}

?>