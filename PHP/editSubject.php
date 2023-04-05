<?php
include_once("database.php");
$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
  // For managing the value of the $fileName for either creating new or maintain value
  $isChanged = $request->isChanged;

  $subjectID = mysqli_real_escape_string($mysqli, trim($request->subjectID));
  $courseCode = mysqli_real_escape_string($mysqli, trim($request->courseCode));
  $title = mysqli_real_escape_string($mysqli, trim($request->title));
  $fileName = mysqli_real_escape_string($mysqli, trim($request->syllabus));

  $randomNumber = rand(1000, 10000);

  // To create a new file based on the $randomNumber
  // If false the $fileName will maintain its value or will not be updated
  if ($isChanged === true) {
    $fileName =  $randomNumber . "-" . mysqli_real_escape_string($mysqli, trim($request->syllabus));
  }

  $sql = "UPDATE subject SET course_code='$courseCode', title='$title', syllabus='$fileName' WHERE id='$subjectID'";

  if ($result = mysqli_query($mysqli, $sql)) {
    echo json_encode($randomNumber);
  } else {
    http_response_code(404);
  }
}
