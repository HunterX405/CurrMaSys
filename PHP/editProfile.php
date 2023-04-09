<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");
  $request = json_decode($postData);

  if (isset($postData) && !empty($postData)) {
    $id = trim($request->id);
    $name = trim($request->name);
    $email = trim($request->email);
    $newPassword = trim($request->newPassword);

    if($newPassword){
      $query = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
      $params = [$name, $email, $newPassword, $id];
    } else {
      $query = "UPDATE users SET name=?, email=? WHERE id=?";
      $params = [$name, $email, $id];
    }

    if (executeQuery($query, $params)) {
      echo json_encode(array(
        "success" => true,
        "message" => "User updated successfully.",
        "user" => array(
          "id" => $id,
          "name" => $name,
          "email" => $email
        ),
      ));
    } else {
      http_response_code(404);
    }
  }
