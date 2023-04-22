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

   function decryption($pass)
  {
    $map = array(
      'a' => 'z',
      'b' => 'y',
      'c' => 'x',
      'd' => 'w',
      'e' => 'v',
      'f' => 'u',
      'g' => 't',
      'h' => 's',
      'i' => 'r',
      'j' => 'q',
      'k' => 'p',
      'l' => 'o',
      'm' => 'n',
      'n' => 'm',
      'o' => 'l',
      'p' => 'k',
      'q' => 'j',
      'r' => 'i',
      's' => 'h',
      't' => 'g',
      'u' => 'f',
      'v' => 'e',
      'w' => 'd',
      'x' => 'c',
      'y' => 'b',
      'z' => 'a',
      '0' => '9',
      '1' => '8',
      '2' => '7',
      '3' => '6',
      '4' => '5',
      '5' => '4',
      '6' => '3',
      '7' => '2',
      '8' => '1',
      '9' => '0',
      'A' => 'Z',
      'B' => 'Y',
      'C' => 'X',
      'D' => 'W',
      'E' => 'V',
      'F' => 'U',
      'G' => 'T',
      'H' => 'S',
      'I' => 'R',
      'J' => 'Q',
      'K' => 'P',
      'N' => 'O',
      'M' => 'N',
      'N' => 'M',
      'O' => 'L',
      'P' => 'K',
      'Q' => 'J',
      'R' => 'I',
      'S' => 'H',
      'T' => 'G',
      'U' => 'F',
      'V' => 'E',
      'W' => 'D',
      'X' => 'C',
      'Y' => 'B',
      'Z' => 'A',
    );
    $decryptedpass = "CuRr".strtr($pass, $map)."MaSyS";
    return $decryptedpass ;
  }

  // To check the $postData
  if (isset($postData) && !empty($postData)) {
    // The $request->email or $request->password depends on the HttpRequest from the service. This is based on the credentials variable on api.service.ts
    $email = mysqli_real_escape_string($mysqli, trim($request->email));
    $password = mysqli_real_escape_string($mysqli, trim($request->password));

    $decryptedpassword = decryption($password);

    // Prepare the SQL query
    $sql = "SELECT name, email, userType, isActive FROM users WHERE password = ? AND email = ? ";
    $stmt = $mysqli->prepare($sql);

    // Bind the parameters to the statement
    $stmt->bind_param("ss", $decryptedpassword,$email);

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