<?php
  include_once("database.php");

  $query = "SELECT id, course_code, title, syllabus FROM subject";

  $result = executeQuery($query);

  if ($result) {
      $resultData = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode(["subjects" => $resultData]);
  } else {
      http_response_code(404);
  }
