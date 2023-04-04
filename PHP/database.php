<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header("Content-Type: application/json; charset=UTF-8");

  // Database Credentials
  $db_host = '34.143.144.134';
  $db_username = 'root';
  $db_password = 'lE@q2%O|Lj28@=N5';
  $db_name = 'currmasysdb';

  // Create connection
  $mysqli = new mysqli($db_host, $db_username, $db_password, $db_name);

  // Check connection
  if ($mysqli->connect_error) {
    die('Connection Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
  }
?>
