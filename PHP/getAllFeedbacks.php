<?php
  include_once("database.php");

  $query = "SELECT * FROM vote";

  $result = executeQuery($query);

  if ($result) {
      $resultData = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode(["allFeedbacks" => $resultData]);
  } else {
      http_response_code(404);
  }
