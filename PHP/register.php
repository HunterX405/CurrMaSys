<?php
include_once("database.php");
$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
  $request = json_decode($postdata);
  $name = trim($request->name);
  $email = trim($request->email);
  $userType = trim($request->userType);

  // Generate random user password
  function generate_password($length = 12)
  {
    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
      $password .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $password;
  }

  // Usage: generate a 16-character password
  $password = generate_password(8);

  $query = "INSERT INTO users(name,email,password, userType, isActive) VALUES (?, ?, ?, ?, '1')";
  $params = [$name, $email, $password, $userType];
  $result = executeQuery($query, $params);

  if ($result) {
    // The data that will be returned to component
    $authdata = [
      'name' => $name,
      'email' => $email,
      'password' => $password,
      'userType' => $userType,
      'isActive' => '1',
      'id' => mysqli_insert_id($mysqli)
    ];
    echo json_encode($authdata);
  }
}
