<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  // Database Credentials
  $db_host = '34.80.20.40';
  $db_username = 'root';
  $db_password = 'D<{.{3y5rR+zxm3X';
  $db_name = 'currmasysdb';

  // Create connection
  $mysqli = new mysqli($db_host, $db_username, $db_password, $db_name);

  // Check connection
  if ($mysqli->connect_error) {
    die('Connection Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
  }
?>
