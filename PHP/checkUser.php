<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");
  require_once('authenticate.php');
  $user = authenticate();

  if(isset($user)){
    $response = array('success' => true, 'message' => 'User is authenticated.');
    echo json_encode(array_merge($response,$user));
  } else {
    $response = array('success' => false, 'message' => 'Session expired. Please login again.');
    echo json_encode($response);
  }
