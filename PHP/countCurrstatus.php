<?php
include_once("database.php");

$currStatus = array("approved", "returned", "pending");
$count = array();

foreach ($currStatus as $currStat) {
  $sql = "SELECT COUNT(*) AS count FROM curriculum WHERE curr_status='$currStat'";
  $result = mysqli_query($mysqli, $sql);

  if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $count[$currStat] = $row['count'];
  } else {
    $count[$currStat] = 0;
  }
}

echo json_encode($count);

mysqli_close($mysqli);
  ?>