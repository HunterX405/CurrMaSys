<?php
  include_once("database.php");
  $postdata = file_get_contents("php://input");

  if (isset($postdata)) {
    $request = json_decode($postdata);
    $course_code = trim($request->course_code);
    $title = trim($request->title);
    $fileName = trim($request->syllabus);
    $prerequisites = $request->prerequisites;

    // $randomNumberr will be returned for the uploadFile function on the SubjectComponent
    if($fileName){
      $randomNumber = rand(1000, 10000);
      $newFileName =  $randomNumber . "-" . $fileName;
    }

    if($course_code && $title){
      $query = "INSERT INTO subject(course_code, title, syllabus) VALUES (?,?,?)";
      $params = [$course_code, $title, $newFileName];
      $result = executeQuery($query, $params);

      if ($result) {
        $subject_id = mysqli_insert_id($mysqli);
        foreach ($prerequisites as $prerequisite) {
          $query = "INSERT INTO prerequisites(subject_id, prerequisite_id) VALUES (?, ?)";
          $params = [$subject_id, $prerequisite];
          executeQuery($query, $params);
        }

        $authdata = [
          'course_code' => $course_code,
          'title' => $title,
          'syllabus' => $newFileName,
        ];
        echo json_encode($authdata);
      }
    }
  }
