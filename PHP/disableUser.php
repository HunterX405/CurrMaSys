<?php
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
  $userid = trim($request->userid);
  $isActive = trim($request->isActive);

  //update boolean value in database
  $query = "UPDATE users SET isActive=? WHERE id=?";
  $params = [$isActive, $userid];

  //return response to angular
  if (executeQuery($query, $params)) {
    echo json_encode(array(
      "success" => true,
      "message" => "Account Deactivated",
      "id" => $userid
    ));
  } else {
    http_response_code(404);
    echo json_encode(array(
      "success" => false,
      "message" => "Account Not Found",
      "id" => $userid
    ));
  }
}
