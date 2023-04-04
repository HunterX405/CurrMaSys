<?php
  include_once("database.php");

  // For JSON Web Tokens (JWT)
  require __DIR__ . '/../vendor/autoload.php';
  use Firebase\JWT\JWT;

  // Accessing the variables and other data from the database.php

  // Reading the data from the HttpRequest or the Service
  $postData = file_get_contents("php://input");
  // Decodes the JSON from the @postData
  $request = json_decode($postData);

  // To check the $postData
  if (isset($postData) && !empty($postData)) {
    // The $request->email or $request->password depends on the HttpRequest from the service. This is based on the credentials variable on api.service.ts
    $email = mysqli_real_escape_string($mysqli, trim($request->email));
    $password = mysqli_real_escape_string($mysqli, trim($request->password));

    // Prepare the SQL query
    $sql = "SELECT name, email, userType, isActive FROM users WHERE email = ? AND password = ?";
    $stmt = $mysqli->prepare($sql);

    // Bind the parameters to the statement
    $stmt->bind_param("ss", $email, $password);

    // Execute the statement
    $stmt->execute();

    // Get the result set
    $result = $stmt->get_result();

    // Check if there is a user with the given credentials
    if ($result->num_rows === 1) {
      // If there is a user, fetch the data and return it as a JSON response
      $user = $result->fetch_assoc();

      // Check if the user account is active.
      if ($user['isActive'] === 0){
        $response = array('success' => false, 'message' => 'Your account is disabled. Please contact the administrator to activate your account.');
        echo json_encode($response);
      } else {
        // Payload for crating a JWT token
        $payload = array(
          'name' => $user['name'],
          'email' => $user['email'],
          'userType' => $user['userType'],
          'exp' => time() + 3600 // Expires in 1 hour
        );
        // Generate a JWT token using the data payload and a secret key
        $skey = 'CurrMaSys';
        $jwt_token = JWT::encode($payload, $skey, 'HS256');
        // Set the JWT token as a cookie in the response
        setcookie('jwt_token', $jwt_token, time() + (60 * 60), '/', '', true, true);

        $response = array('success' => true,
                          'user' => $user,
                          'jwt' => $jwt_token);

        echo json_encode($response);
      }
    } else {
      // If there is no user, return an error message
      $response = array('success' => false, 'message' => 'Invalid username or password.');
      echo json_encode($response);
    }

    // Close the statement and database connection
    $stmt->close();
    $mysqli->close();
  } else {
    $response = array('success' => false, 'message' => 'Login credentials are required.');
    echo json_encode($response);
  }
?>
