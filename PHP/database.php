<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  // Define the database credentials as constants
  $config = require_once('config.php');
  define('DB_HOST', $config['host']);
  define('DB_USERNAME', $config['username']);
  define('DB_PASSWORD', $config['password']);
  define('DB_NAME', $config['database']);

  // Create connection
  $mysqli = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, null, MYSQLI_CLIENT_FOUND_ROWS);

  // Check connection
  if (!$mysqli) {
    die('Connection Error : ('. mysqli_connect_errno() .') '. mysqli_connect_error());
  }

  function executeQuery($query, $params = []) {
    global $mysqli;

    try {
      $stmt = $mysqli->prepare($query);
      if ($params) {
        $stmt->bind_param(str_repeat('s', count($params)), ...$params);
      }
      $stmt->execute();
      $result = $stmt->get_result();
      if(!$result) {
        $result = $stmt->affected_rows;
      }
      $stmt->close();

      return $result;
    } catch (Exception $e) {
      http_response_code(500);
      die('Database query error: ' . $e->getMessage());
    }
  }
