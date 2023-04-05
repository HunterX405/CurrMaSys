<?php
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {

  $subjectID = trim($request->subjectID);
  $course_code = trim($request->course_code);
  $title = trim($request->title);
  $fileName = trim($request->syllabus);

  // To create a new file based on the $randomNumber
  // If false the $fileName will maintain its value or will not be updated
  if ($fileName) {
    $randomNumber = rand(1000, 10000);
    $fileName = $randomNumber . "-" . $fileName;
    $query = "UPDATE subject SET course_code=?, title=?, syllabus=? WHERE id=?";
    $params = [$course_code, $title, $fileName, $subjectID];
  } else {
    $query = "UPDATE subject SET course_code=?, title=? WHERE id=?";
    $params = [$course_code, $title, $subjectID];
  }

  try {
    if (executeQuery($query, $params)) {
      http_response_code(200);
      echo json_encode(array(
        "subjectID" => $subjectID,
        "course_code" => $course_code,
        "title" => $title,
        "fileName" => $fileName
      ));
    } else {
      http_response_code(404);
    }

  } catch (Exception $e) {
    http_response_code(500);
    echo "Error updating subject: " . $e->getMessage();
  }
}
?>