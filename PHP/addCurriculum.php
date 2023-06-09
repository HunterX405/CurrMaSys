<?php
include_once("database.php");
$postdata = file_get_contents("php://input");

if (isset($postdata)) {
   $request = json_decode($postdata);
   $department = trim($request->department);
   $version = trim($request->version);
   $firstYearFirstSem = $request->firstYearFirstSemSubjects;
   $firstYearSecondSem = $request->firstYearSecondSemSubjects;
   $secondYearFirstSem = $request->secondYearFirstSemSubjects;
   $secondYearSecondSem = $request->secondYearSecondSemSubjects;
   $thirdYearFirstSem = $request->thirdYearFirstSemSubjects;
   $thirdYearSecondSem = $request->thirdYearSecondSemSubjects;
   $fourthYearFirstSem = $request->fourthYearFirstSemSubjects;
   $fourthYearSecondSem = $request->fourthYearSecondSemSubjects;

   $subjectsArray = [
      array("arr" => $firstYearFirstSem, "year" => 1, "sem" => 1),
      array("arr" => $firstYearSecondSem, "year" => 1, "sem" => 2),
      array("arr" => $secondYearFirstSem, "year" => 2, "sem" => 1),
      array("arr" => $secondYearSecondSem, "year" => 2, "sem" => 2),
      array("arr" => $thirdYearFirstSem, "year" => 3, "sem" => 1),
      array("arr" => $thirdYearSecondSem, "year" => 3, "sem" => 2),
      array("arr" => $fourthYearFirstSem, "year" => 4, "sem" => 1),
      array("arr" => $fourthYearSecondSem, "year" => 4, "sem" => 2),
   ];

   // Add curriculums
   $query = "INSERT INTO curriculum(department, version) VALUES (?,?)";
   $params = [$department, $version];
   $result = executeQuery($query, $params);

   if ($result) {
      $curr_id = mysqli_insert_id($mysqli);
      // ADD subjects
      foreach ($subjectsArray as $subjects) {
         foreach ($subjects['arr'] as $subject) {
            $query = "INSERT INTO curriculum_subjects(curr_id, subject_id, lec_units, lab_units, hrs, curr_ver, year, semester) VALUES (?,?,?,?,?,?,?,?)";
            $params = [$curr_id, $subject->course, $subject->lec_units, $subject->lab_units, $subject->hrs, 1, $subjects['year'], $subjects['sem']];
            $result = executeQuery($query, $params);

            // Get the id of the inserted curriculum subjects
            $curr_sub_id = mysqli_insert_id($mysqli);

            // Adding pre-requisites
            if($subject->pre_req != ''){
               foreach ($subject->pre_req as $req) {
                  $query = "INSERT INTO pre_requisites(curr_subject_id, pre_requisite_id) VALUES (?,?)";
                  $params = [$curr_sub_id, $req];
                  $result = executeQuery($query, $params);
               }
            }

            // Adding co-requisite
            if($subject->co_req != ''){
               $query = "INSERT INTO co_requisites(curr_subject_id, co_requisite_id) VALUES (?,?)";
               $params = [$curr_sub_id, $subject->co_req];
               $result = executeQuery($query, $params);
            }

         }
      }
      $response = [
         'success' => true,
         'message' => 'Curriculum Added Successfully',
         'curr_id' => $curr_id,
      ];
   } else {
      $response = [
         'success' => false,
         'message' => 'Failed to add curriculum',
         'department' => $department,
      ];
   }
   echo json_encode($response);
}
