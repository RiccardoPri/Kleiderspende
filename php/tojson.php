<?php

/*********************************************************************************
PHP personalData for: Studienarbeit Programmierung von Webanwendungsoberflächen
Description: Fiktive Vereinsseite für zur Registrierung von Kleiderspenden

Version: 1.0
Author: Riccardo Princiotto
License: none
Tags: PHP, Ajax, mysql, json

Notices: this php-file get the information for donation from mysql
        and store the donation data in an individual json file
**********************************************************************************/

if(isset($_POST['checkout'])) {
/************ connection to database with user and reduced rights ***********/
    $connection = new mysqli('localhost', 'user', '8]RWm[qpSkW_(x?', 'kleiderspende');
    //on error with connection
    if(mysqli_connect_error()) {
        die("Verbindungsfehler zur Datenbank");
    }
/****************get the post variables from jquery ajax send*****************/
    $table = $connection->real_escape_string($_POST['tablePHP']);
/******* convert POST from tablePHP to string ***********/
    $tablename = strval($table);

/************* get the donations to json file ******************/
    $jsonFile = "json/".$tablename."Summery.json";
    $sql = "SELECT * FROM $tablename";

    $result = mysqli_query($connection, $sql);

    $json_array = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $json_array[] = $row;
    }

    file_put_contents($jsonFile, json_encode($json_array));
    
    $connection->close();
        exit('json file created');
}

?>