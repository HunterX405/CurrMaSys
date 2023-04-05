<?php
include_once("database.php");
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $courseCode = mysqli_real_escape_string($mysqli, trim($request->courseCode));
    $title = mysqli_real_escape_string($mysqli, trim($request->title));

    // $randomNumberr will be returned for the uploadFile function on the SubjectComponent
    $randomNumber = rand(1000, 10000);
    $fileName =  $randomNumber . "-" . mysqli_real_escape_string($mysqli, trim($request->syllabus));

    $sql = "INSERT INTO subject(course_code, title, syllabus) VALUES ('$courseCode', '$title', '$fileName')";
    
    if ($result = mysqli_query($mysqli, $sql)) {
        $authdata = [
            'id' => mysqli_insert_id($mysqli),
            'courseCode' => $courseCode,
            'title' => $title,
            'syllabus' => $fileName,
            'randomNumber' => $randomNumber
        ];
        echo json_encode($authdata);
    }
}
