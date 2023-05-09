<?php
// For editing the selected data on the ElectiveSubjComponent
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {

  $electiveID = trim($request->electiveID);
  $title = trim($request->title);
  $fileName = trim($request->syllabus);
  $description = trim($request->description);

  // To create a new file based on the $randomNumber
  // If false the $fileName will maintain its value or will not be updated
  if ($fileName) {
    $randomNumber = rand(1000, 10000);
    $fileName = $randomNumber . "-" . $fileName;
    $query = "UPDATE elective SET elective_title=?, elective_syllabus=?, description=? WHERE id=?";
    $params = [$title, $fileName, $description, $electiveID];
  } else {
    $query = "UPDATE elective SET elective_title=?, description=? WHERE id=?";
    $params = [$title, $description, $electiveID];
  }

  try {
    if (executeQuery($query, $params)) {
      http_response_code(200);
      echo json_encode(array(
        "electiveID" => $electiveID,
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
