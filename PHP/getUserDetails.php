<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  include_once("database.php");
  require_once('authenticate.php');
  $user = authenticate();
  if(isset($user)){
    $response = array('success' => true, 'message' => 'User is authenticated.');

    // Prepare the SQL query
    $sql = "SELECT name, email, userType FROM users WHERE email = ?";
    $stmt = $mysqli->prepare($sql);

    // Bind the parameters to the statement
    $stmt->bind_param("s", $user['email']);

    // Execute the statement
    $stmt->execute();

    // Get the result set
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
      $userDetails = $result->fetch_assoc();
      echo json_encode(array_merge($response,$userDetails));
    } else {
      $response = array('success' => false, 'message' => 'Account not found. Please login again.');
      echo json_encode($response);
    }
  } else {
    $response = array('success' => false, 'message' => 'Session expired. Please login again.');
    echo json_encode($response);
  }

?>
