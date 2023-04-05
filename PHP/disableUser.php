<?php
include_once("database.php");

$method = $_SERVER['REQUEST_METHOD'];
$postData = file_get_contents("php://input");
$request = json_decode($postData);

if ($method === 'GET'){
    $id = $_GET['id'];
    // Selecting all properties of the table users
    $sql = "SELECT * FROM users WHERE id = $id";

    $result = mysqli_query($mysqli, $sql);
    $data = mysqli_fetch_assoc($result);

    // Return the data as JSON
    header('Content-Type: application/json');
    echo json_encode($data);
    mysqli_close($mysqli);
}

if ($method === 'POST') {
  if (isset($postData) && !empty($postData)) {
    $userid = mysqli_real_escape_string($mysqli, trim($request->userid));
    $isActive = mysqli_real_escape_string($mysqli, trim($request->isActive));
    
    //update boolean value in database
    $sql = "UPDATE users SET isActive = '$isActive' WHERE id = '$userid'";
    
    //return response to angular
    if ($result = mysqli_query($mysqli, $sql)) {
        echo json_encode($result);
        mysqli_close($mysqli);
      } else {
        http_response_code(404);
      }
}}
