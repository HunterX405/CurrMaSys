<?php
  include_once("database.php");

  $resultData = [];
  // Selecting all properties of the table users
  $sql = "SELECT * FROM subject";

  if ($result = mysqli_query($mysqli, $sql)) {
    $i = 0;
    // The data that will be returned
    while ($dbRow = mysqli_fetch_assoc($result)) {
      $resultData[$i]["id"] = $dbRow["id"];
      $resultData[$i]["course_code"] = $dbRow["course_code"];
      $resultData[$i]["title"] = $dbRow["title"];
      $resultData[$i]["syllabus"] = $dbRow["syllabus"];
      $i++;
    }
    // Returns an array
    echo json_encode(["data" => $resultData]);
  } else {
    http_response_code(404);
  }
