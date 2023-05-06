<?php
  include_once("database.php");
  $postdata = file_get_contents("php://input");

  if (isset($postdata)) {
    $request = json_decode($postdata);
    $course_code = trim($request->course_code);
    $title = trim($request->title);
    $type = trim($request->subjType);
    $description = trim($request->description);
    $fileName = trim($request->syllabus);


    // $randomNumberr will be returned for the uploadFile function on the SubjectComponent
    // To manage IF the USER have not submitted a syllabus
    // Applied due to suggested revisions
    if($fileName !== ""){
      $randomNumber = rand(1000, 10000);
      $newFileName =  $randomNumber . "-" . $fileName;
    } else {
      $newFileName = "";
    }

    if($course_code && $title){
      $query = "INSERT INTO subject(course_code, title, syllabus, type, description) VALUES (?,?,?,?,?)";
      $params = [$course_code, $title, $newFileName, $type, $description];
      $result = executeQuery($query, $params);

      if ($result) {
        $authdata = [
          'course_code' => $course_code,
          'title' => $title,
          'syllabus' => $newFileName,
          'type' => $type,
          'description' => $description,
        ];
        echo json_encode($authdata);
      }
    }
  }