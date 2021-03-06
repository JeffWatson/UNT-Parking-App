<?php
  /**
   * $db is discount database for app to fetch updates from
   * @var SQLite3 database
   */
  $db = new SQLite3('discounts.db');

  /**
   * $selectStar is SQLite steatement to fetch ALL rows from discounts.db
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
  $result->fetchArray(SQLITE3_ASSOC);

  /**
   * $row is each discount row from database
   * @var associative array
   */
  $i = 0;
  while ( $row = $result->fetchArray( SQLITE3_ASSOC ) ) {
    // print the array in JSON format
    $rows[$i] = $row;
    $i++;
  }

/* prettier formatting in a table witout JSON, possibly use to display discounts on main page
  echo "<table>";
  while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    foreach($row as $key => $value)
      echo "<tr><td>$key</td><td>$value</td></tr>";
  }
  echo "</table>";
*/
?>