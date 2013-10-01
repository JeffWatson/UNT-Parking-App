<?php
$capacity = $_POST['capacity'];
$discount = $_POST['discount'];
$parking_array = array("capacity" => $capacity, "discount" => $discount);

  echo "current capacity is: ". $capacity . "</br>";
  echo "\n";
  echo "current discount is: ". $discount . "</br>";

  echo json_encode($parking_array);
?>