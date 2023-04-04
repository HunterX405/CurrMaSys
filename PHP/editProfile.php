<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");
  $request = json_decode($postData);

  if (isset($postData) && !empty($postData)) {
    $name = mysqli_real_escape_string($mysqli, trim($request->name));
    $email = mysqli_real_escape_string($mysqli, trim($request->email));
    $newPassword = mysqli_real_escape_string($mysqli, trim($request->newPassword));

    $sql = "UPDATE users SET name='$name', email='$email', password='$newPassword' WHERE email='$email'";

    if ($result = mysqli_query($mysqli, $sql)) {
      echo json_encode($result);
    } else {
      http_response_code(404);
    }
  }
?>
