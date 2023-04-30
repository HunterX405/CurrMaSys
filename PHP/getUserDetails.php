<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  include_once("database.php");
  if (isset($_GET['email'])) {
   $email = $_GET['email'];

    $response = array('success' => true, 'message' => 'User is authenticated.');

    $query = "SELECT id, name, email, userType FROM users WHERE email=?";
    $params = [$email];

    $result = executeQuery($query, $params);
    if ($result) {
      $userDetails = $result->fetch_assoc();
      echo json_encode(array_merge($response,$userDetails));
    } else {
      $response = array('success' => false, 'message' => 'Account not found. Please login again.');
      echo json_encode($response);
    }
  } else {
    $response = array('success' => false, 'message' => 'Session expired. Please login again.', 'email' => 'email');
    echo json_encode($response);
  }
