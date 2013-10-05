<?php
$date_start = $_POST['startdate'];
$date_end = $_POST['enddate'];
$time_start = $_POST['starttime'];
$time_end = $_POST['endtime'];
$discount_value = $_POST['discount'];
$vendor_name = $_POST['vendor'];
$discount_array = array("startdate" => $date_start, "enddate" => $date_end, "starttime" => $time_start, "endtime" => $time_end, "value" => $discount_value, "vendor" => $vendor_name);

  echo json_encode($discount_array);
?>
