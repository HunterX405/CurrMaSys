<?php
  include_once("database.php");

  $query = "SELECT * FROM subject WHERE type='ProfE'";

  $result = executeQuery($query);

  if ($result) {
      $resultData = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode(["electives" => $resultData]);
  } else {
      http_response_code(404);
  }
