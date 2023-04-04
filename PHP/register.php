<?php
include_once("database.php");
$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
  $request = json_decode($postdata);
  $name = trim($request->name);
  $email = mysqli_real_escape_string($conn, trim($request->email));
  $password = mysqli_real_escape_string($conn, trim($request->password));
  $userType = mysqli_real_escape_string($conn, trim($request->userType));
  // The value is 1 because of the phpmyadmin
  $isActive = 1;

  $sql = "INSERT INTO users(name,email,password, userType, isActive) VALUES ('$name', '$email', '$password', '$userType', '$isActive')";

  if ($result = mysqli_query($conn, $sql)) {
    // The data that will be returned to component
    $authdata = [
        'name' => $name,
        'email' => $email,
        'pwd' => '',
        'userType' => $userType,
        'isActive' => $isActive,
        'id' => mysqli_insert_id($conn)
    ];
    echo json_encode($authdata);
  }
}
