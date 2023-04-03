<?php
include_once("database.php");
$postdata = file_get_contents("php://input");

if (isset($postdata)) {
    $request = json_decode($postdata);
    $courseCode = mysqli_real_escape_string($mysqli, trim($request->courseCode));
    $title = mysqli_real_escape_string($mysqli, trim($request->title));
    $pname = rand(1000, 10000) . "-" . $FILES["syllabus"]["name"];

    $test = rand(1000, 10000) . "-" . $request->syllabus;
    $tname = $FILES["syllabus"]["tmp_name"];
    $dir = "PDF/";

    move_uploaded_file($tname, $dir . "/" . $test);

    $sql = "INSERT INTO subjects(courseCode, title, syllabus) VALUES ('$courseCode', '$title', '$test')";
    if ($result = mysqli_query($mysqli, $sql)) {
        $authdata = [
            'courseCode' => $courseCode,
            'title' => $title,
            'id' => mysqli_insert_id($mysqli)
        ];
        echo json_encode($authdata);
    }
}
