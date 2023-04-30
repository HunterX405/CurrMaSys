<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");
  $request = json_decode($postData);

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

   function generate_password($length = 12)
  {
    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
      $password .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $password;
  }

  if (isset($postData) && !empty($postData)) {
    $email = trim($request->email);
    $newPassword = generate_password(8);
    $newEncryptedPassword = encryption($newPassword);

    $query = "UPDATE users SET password=? WHERE email=?";
    $params = [$newEncryptedPassword, $email];

    if (executeQuery($query, $params)) {
      echo json_encode(array(
        "success" => true,
        "message" => "Password Reset Successfull.",
        "email" => $email,
        "newPassword" => $newPassword
      ));
    } else {
      echo json_encode(array(
        "success" => false,
        "message" => "Email does not exist or password is correct and does not need to be reset.",
        "email" => $email,
      ));
    }
  }
