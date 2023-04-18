<?php
include_once("database.php");

$tables = array("users","subject","elective");
$count = array();

foreach ($tables as $table) {
    $sql = "SELECT COUNT(*) AS count FROM $table";
    $result = mysqli_query($mysqli, $sql);
  
    if (mysqli_num_rows($result) > 0) {
      $row = mysqli_fetch_assoc($result);
      $count[$table] = $row['count'];
    } else {
      $count[$table] = 0;
    }
  }
  echo json_encode($count);
  
  mysqli_close($mysqli);
  ?>