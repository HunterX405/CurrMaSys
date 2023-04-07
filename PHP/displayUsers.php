<?php
  include_once("database.php");

  $resultData = [];
  // Selecting all properties of the table users
  $query = "SELECT id, name, email, userType, isActive FROM users";
  $result = executeQuery($query);

  if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["users" => $resultData]);
  } else {
    http_response_code(404);
  }
?>
