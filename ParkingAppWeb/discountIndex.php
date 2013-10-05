<!DOCTYPE html>
<html>
<head>
  <title>UNT Parking Garage Console</title>
  <link rel="stylesheet" type="text/css" href="parkingServices.css" />
</head>

<body>
  <h1>UNT Parking Garage Capacity</h1>
  <form action="process.php" method="post" name="garage_values" id="garage_values" >
    Current parking capacity:
    <select name="capacity">
      <option value="0">0%</option>
      <option value="10">10%</option>
      <option value="20">20%</option>
      <option value="30">30%</option>
      <option value="40">40%</option>
      <option value="50">50%</option>
      <option value="60">60%</option>
      <option value="70">70%</option>
      <option value="80">80%</option>
      <option value="90">90%</option>
      <option value="100">100%</option>
    </select>
    </br>Current Parking Discount:
    <select name="discount">
      <option value="0">0%</option>
      <option value="10">10%</option>
      <option value="20">20%</option>
      <option value="30">30%</option>
      <option value="40">40%</option>
      <option value="50">50%</option>
      <option value="60">60%</option>
      <option value="70">70%</option>
      <option value="80">80%</option>
      <option value="90">90%</option>
      <option value="100">100%</option>
    </select>
    </br>
    <input type="submit" name="update_values" value="update garage" />
  </form>
</body>

</html>

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
$results =  $statement->execute();

// fetch an array for every row
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    // print the array in JSON format
    echo json_encode($row);
}

