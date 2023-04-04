<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");
  $request = json_decode($postData);

  if (isset($postData) && !empty($postData)) {
    $email = mysqli_real_escape_string($conn, trim($request->email));
    $newPassword = mysqli_real_escape_string($conn, trim($request->newPassword));

    $sql = "UPDATE users SET password='$newPassword' WHERE email='$email'";

    if ($result = mysqli_query($conn, $sql)) {
      // Unused because of of the HTTP Error 200
      // $rows = array();
      // while ($row = mysqli_fetch_assoc($result)) {
      //     $rows[] = $row;
      // }
      echo json_encode($result);
    } else {
      http_response_code(404);
    }
  }
?>
