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

  if (isset($postData) && !empty($postData)) {
    $id = trim($request->id);
    $name = trim($request->name);
    $email = trim($request->email);
    $newPassword = trim($request->newPassword);
    $newEncryptedPassword = encryption($newPassword);

    if($newEncryptedPassword){
      $query = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
      $params = [$name, $email, $newEncryptedPassword, $id];
    } else {
      $query = "UPDATE users SET name=?, email=? WHERE id=?";
      $params = [$name, $email, $id];
    }

    if (executeQuery($query, $params)) {
      echo json_encode(array(
        "success" => true,
        "message" => "User updated successfully.",
        "user" => array(
          "id" => $id,
          "name" => $name,
          "email" => $email
        ),
      ));
    } else {
      http_response_code(404);
    }
  }
