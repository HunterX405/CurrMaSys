<?php
include_once("database.php");
$postdata = file_get_contents("php://input");

if (isset($postdata)) {
    $request = json_decode($postdata);
    $courseCode = trim($request->courseCode);
    $title = trim($request->title);

    // $randomNumberr will be returned for the uploadFile function on the SubjectComponent
    $fileName = trim($request->syllabus);
    if($fileName){
      $randomNumber = rand(1000, 10000);
      $newFileName =  $randomNumber . "-" . trim($request->syllabus);
    }

    $query = "INSERT INTO subject(course_code, title, syllabus) VALUES ('$courseCode', '$title', '$newFileName')";

    if (executeQuery($query)) {
      $authdata = [
        'courseCode' => $courseCode,
        'title' => $title,
        'syllabus' => $fileName,
        'randomNumber' => $randomNumber
      ];
      echo json_encode($authdata);
    }
}

// include_once("database.php");
// $postdata = file_get_contents("php://input");

// if (isset($postdata)) {
//     $request = json_decode($postdata);
//     $courseCode = mysqli_real_escape_string($mysqli, trim($request->courseCode));
//     $title = mysqli_real_escape_string($mysqli, trim($request->title));

//     $fileName = rand(1000, 10000) . "-" . $request->syllabus;
//     // $fileName = rand(1000, 10000) . "-" . $FILES[$request->syllabus]["name"];
//     $tempName = $FILES["syllabus"]["tmp_name"];
//     $filePath = "../../../PDF/" . $fileName;

//     move_uploaded_file($tempName, $filePath);

//     $sql = "INSERT INTO subjects(courseCode, title, syllabus) VALUES ('$courseCode', '$title', '$fileName')";
//     if ($result = mysqli_query($mysqli, $sql)) {
//         $authdata = [
//             'courseCode' => $courseCode,
//             'title' => $title,
//             'id' => mysqli_insert_id($mysqli)
//         ];
//         echo json_encode($result);
//     }

//     // $fileName = rand(1000, 10000) . "-" . $FILES["syllabus"]["name"];
//     // $dir = "PDF/";
// }
