<?php
/**
 * User: Jeff Watson
 * Date: 9/19/13
 * Time: 8:04 PM
 */

// GET parameter 'name' from the URL
$name = htmlspecialchars($_GET["name"]);

// Echo the name we got back to the user.
// i.e. http://localhost/ParkingService.php?name=Foo
echo 'Hello ' . $name . '!';

// connect to database
$db = new SQLite3('./parking.db');

// select everything in the database
$statement = $db->prepare('SELECT * FROM parking;');
$results = $statement->execute();

// fetch an array for every row
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    // print the array in JSON format
    echo json_encode($row);
}

