<?php
  include_once("database.php");
  $postData = file_get_contents("php://input");

  if (isset($postData) && !empty($postData)) {
    $request = json_decode($postData);
    $subjectID = trim($request->subjectID);

    $query = "SELECT * FROM subject WHERE id=?";
    $params = [$subjectID];

    $result = executeQuery($query, $params);
    if ($result) {
      $resultData = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode($resultData);
    } else {
        http_response_code(404);
    }
  }
?>