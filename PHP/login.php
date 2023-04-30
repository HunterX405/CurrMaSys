<?php
include_once("database.php");

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
      'L' => 'O',
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
   $decryptedpass = "CuRr" . strtr($pass, $map) . "MaSyS";
   return $decryptedpass;
}

$response = array('success' => false, 'message' => 'Login credentials are required.');
// To check the $postData
if (isset($postData) && !empty($postData)) {
   // The $request->email or $request->password depends on the HttpRequest from the service. This is based on the credentials variable on api.service.ts
   $email = trim($request->email);
   $password = trim($request->password);

   $decryptedpassword = decryption($password);

   $query = "SELECT id, name, email, userType, isActive FROM users WHERE password = ? AND email = ? ";
   $params = [$decryptedpassword, $email];

   $result = executeQuery($query, $params);

   // Check if there is a user with the given credentials
   if ($result->num_rows === 1) {
      // If there is a user, fetch the data and return it as a JSON response
      $user = $result->fetch_assoc();

      // Check if the user account is active.
      if ($user['isActive'] === 0) {
         $response = array('success' => false, 'message' => 'Your account is disabled. Please contact the administrator to activate your account.');
      } else {
         $response = array('success' => true, 'user' => $user);
      }
   } else {
      // If there is no user, return an error message
      $response = array('success' => false, 'message' => 'Invalid username or password.');
   }
}

echo json_encode($response);
