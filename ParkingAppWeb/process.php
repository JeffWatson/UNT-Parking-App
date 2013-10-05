<?php
  /**
   * $db is discount database for app to fetch updates from
   * @var SQLite3 database
   */
  $db = new SQLite3('discounts.db');

  /**
   * $createTable is SQLite3 command
   * @var string
   */
  $createTable = "CREATE TABLE IF NOT EXISTS promotions (id INTEGER PRIMARY KEY,
    start_date TEXT, stop_date TEXT, start_time TEXT, stop_time TEXT, promotion_name TEXT,
    promotion_value TEXT, lat NUMBER, lon NUMBER, vendor TEXT, link TEXT);";

  /**
   * $insertDiscount is SQLite3 command to insert posted values from discountindex.php to promotions
   * table in discounts.db
   * @var string
   */
  $insertDiscount = "INSERT INTO promotions (start_date, stop_date, start_time, stop_time, promotion_value, vendor)
                     VALUES ('$_POST[startdate]', '$_POST[enddate]', '$_POST[starttime]', '$_POST[endtime]',
                      '$_POST[discount]', '$_POST[vendor]');";

  /**
   * $statement is SQLite3 prepared command executed by execute()
   * @var SQLite3Stmt
   */
  $statement = $db->prepare($createTable);
  $statement->execute();

  $db->exec($insertDiscount);
?>

<a href="discountindex.php">discount inserted, return to previous page</a>
<br />
<a href="getDiscounts.php">see all inserted discounts</a>