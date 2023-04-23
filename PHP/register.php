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

  function encryption($pass)
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
    $encryptedpass = "CuRr".strtr($pass, $map)."MaSyS";
    return $encryptedpass ;
  }

  // Usage: generate a 16-character password
  $password = generate_password(8);
  $encryptedpassword = encryption($password);

  $query = "INSERT INTO users(name,email,password, userType, isActive) VALUES (?, ?, ?, ?, '1')";
  $params = [$name, $email, $encryptedpassword, $userType];
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