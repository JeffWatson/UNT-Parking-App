<!DOCTYPE html>
<!-- This site was created in Webflow. http://www.webflow.com--><!-- Last Published: Sat Oct 05 2013 01:19:31 GMT+0000 (UTC) -->
<html data-wf-site="524dc72fe439c360410001ad">
  <head>
    <meta charset="utf-8">
    <title>Discount UNT App</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/normalize.css">
    <link rel="stylesheet" type="text/css" href="css/webflow.css">
    <link rel="stylesheet" type="text/css" href="css/discountuntapp.css">
  </head><body>
  <div class="nav-section">
    <div class="w-container header">
      <div class="w-row">
        <div class="w-col w-col-8">
          <h1 class="w-hidden-tiny">UNT Discount App Management</h1>
        </div>
        <div class="w-col w-col-4">
          <img class="headerimage" src="images/combo_stacked_one-line_WHTongreen_0.png" width="409" alt="combo_stacked_one-line_WHTongreen_0.png">
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="w-container">
      <div class="w-row">
        <div class="w-col w-col-1 w-clearfix"><a class="w-hidden-tiny button expand" href="#">Expand</a>
        </div>
        <div class="w-col w-col-11 discountcolumn">
          <form action="process.php" name="wf-form-new-discount" method="post" name="discount_values" id="discount_values">
            <label class="tableheader" for="name">Create New Discount</label>
            <div class="w-row">
              <div class="w-col w-col-5">
                <div class="w-container formsection">
                  <div class="formlabel">Start Date:</div>
                  <input class="w-input textfield" type="text" placeholder="MM/DD/YYYY" name="startdate" data-name="startDate" required="required"></input>
                  <div class="formlabel">End Date:</div>
                  <input class="w-input" type="text" placeholder="MM/DD/YYYY" name="enddate" data-name="endDate" required="required"></input>
                </div>
              </div>
              <div class="w-col w-col-2"></div>
              <div class="w-col w-col-5">
                <div class="w-container formsection">
                  <div class="formlabel">Start Time:</div>
                  <input class="w-input textfield" type="text" placeholder="00:00" name="starttime" data-name="startTime" required="required"></input>
                  <div class="formlabel">End Time:</div>
                  <input class="w-input" type="text" placeholder="24:00" name="endtime" data-name="endtime" required="required"></input>
                </div>
              </div>
            </div>
            <br>
            <br>
            <br>
            <div class="w-row">
              <div class="w-col w-col-5">
                <div class="w-container formsection">
                  <div class="formlabel">Discount Value:</div>
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
                </div>
              </div>
              <div class="w-col w-col-2"></div>
              <div class="w-col w-col-5">
                <div class="w-container formsection">
                  <div class="formlabel">Vendor:</div>
                  <select name="vendor">
                    <option value="parking">Parking</option>
                  </select>
                  <input class="w-button button submit" type="submit" value="Submit" data-wait="Please wait..."></input>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="w-container managecontainer">
      <h2>Manage Current Discounts</h2>
      <div class="w-container">
        <div class="w-container managebox">
          <div class="w-form">
            <label class="tableheader" for="name">Value:</label>
            <div class="w-form-done">
              <p>Thank you! Your submission has been received!</p>
            </div>
            <div class="w-form-fail">
              <p>Oops! Something went wrong while submitting the form :(</p>
            </div>
          </div>
          <div class="w-container">
            <p>THIS
              <br>WILL
              <br>BE
              <br>A
              <br>PRETTY
              <br>TABLE</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
<!-- Wasn't sure if we needed this yet so I shoved it in at the bottom for now...
-Matt
-->
<?php
/**
 * User: Jeff Watson
 * Date: 9/19/13
 * Time: 8:04 PM
*/
 
/*
//GET parameter 'name' from the URL
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
*/
?>
