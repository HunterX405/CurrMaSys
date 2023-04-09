<?php
  // For JSON Web Tokens (JWT)
  require __DIR__ . '/../vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  function authenticate() {
    $headers = apache_request_headers();

    if (isset($headers['Authorization'])) {
      $authorizationHeader = $headers['Authorization'];
      $token = explode(' ', $authorizationHeader)[1];

      if (isset($token)) {
        try {
          $secretKey = 'CurrMaSys';
          $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
          return array(
            'name' => $decoded->name,
            'email' => $decoded->email,
            'userType' => $decoded->userType
          );
        } catch (Exception $e) {
          echo $e;
          return null;
        }
      }
    }
  }
