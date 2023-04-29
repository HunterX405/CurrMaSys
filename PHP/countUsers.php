<?php
include_once("database.php");

$userTypes = array("admin", "chair", "stakeholder", "member");
$count = array();

foreach ($userTypes as $userType) {
  $sql = "SELECT COUNT(*) AS count FROM users WHERE userType='$userType'";
  $result = mysqli_query($mysqli, $sql);

  if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $count[$userType] = $row['count'];
  } else {
    $count[$userType] = 0;
  }
}

echo json_encode($count);

mysqli_close($mysqli);
  ?>