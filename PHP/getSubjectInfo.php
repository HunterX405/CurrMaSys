<?php
include_once("database.php");
$postData = file_get_contents("php://input");

$resultData = [];

if (isset($postData) && !empty($postData)) {
    $request = json_decode($postData);
    $subjectID = mysqli_real_escape_string($mysqli, trim($request->subjectID));

    $sql = "SELECT * FROM subject WHERE id='$subjectID'";

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
      echo json_encode($resultData);
    } else {
      http_response_code(404);
    }
}
