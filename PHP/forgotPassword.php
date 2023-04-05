<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");
  $request = json_decode($postData);

  if (isset($postData) && !empty($postData)) {
    $email = trim($request->email);
    $newPassword = trim($request->newPassword);

    $query = "UPDATE users SET password=? WHERE email=?";
    $params = [$newPassword, $email];

    if (executeQuery($query, $params)) {
      echo json_encode(array(
        "success" => true,
        "message" => "Password Reset Successfull.",
        "email" => $email
      ));
    } else {
      echo json_encode(array(
        "success" => false,
        "message" => "Email does not exist or password is correct and does not need to be reset.",
        "email" => $email
      ));
    }
  }
?>
