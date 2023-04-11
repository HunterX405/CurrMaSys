<?php
// For retreving specific data based on the ID of the selected Elective Subject
include_once("database.php");
$postData = file_get_contents("php://input");

if (isset($postData) && !empty($postData)) {
  $request = json_decode($postData);
  $electiveID = trim($request->electiveID);

  $query = "SELECT * FROM elective WHERE id=?";
  $params = [$electiveID];

  $result = executeQuery($query, $params);
  if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($resultData);
  } else {
    http_response_code(404);
  }
}
