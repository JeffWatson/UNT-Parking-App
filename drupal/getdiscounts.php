<?php

  /**
   * $db is discount database for app to fetch updates from
   * @var SQLite3 database
   */
  $db = new SQLite3('sites/default/files/.discountsquad-drupal.sqlite');

  /**
   * $selectStar is SQLite statement to fetch ALL rows from discounts.db
   * @var string
   */
  $selectStar = "SELECT * FROM promotions;";

  /**
   * $statement is SQLite3 prepared command executed by execute()
   * @var SQLite3Stmt
   */
  $statement = $db->prepare($selectStar);

  /**
   * $result is A class that handles result sets for the SQLite 3 extension
   * @var SQLite3Result
   */
  $result = $statement->execute();
  //$result->fetchArray(SQLITE3_ASSOC); //This seems to be hiding the first row so I removed it --Matt

  /**
   * $row is each discount row from database
   * @var associative array
   */
  $i = 0;
  while ( $row = $result->fetchArray( SQLITE3_ASSOC ) ) {
    // encode in json
    $rows[$i] = $row;
    $i++;
  }
  // print the array in JSON format
  echo json_encode( $rows );

/* prettier formatting in a table witout JSON, possibly use to display discounts on main page
  echo "<table>";
  while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    foreach($row as $key => $value)
      echo "<tr><td>$key</td><td>$value</td></tr>";
  }
  echo "</table>";
*/
?>
