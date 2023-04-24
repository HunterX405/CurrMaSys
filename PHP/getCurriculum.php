<?php
// To access all data based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
   $curriculumID = $request->currId;

   $query = "SELECT * FROM curriculum WHERE id=?";
   $params = [$curriculumID];
   $result = executeQuery($query, $params);

   if ($result) {
      $curriculum = $result->fetch_assoc();
      $curriculumVersion = $curriculum['version_id'];
      $resultData['curriculum'] = $curriculum;

      $query = "SELECT s.course_code, s.title,
                        cs.lec_units, cs.lab_units, cs.total_units, cs.hrs, cs.year, cs.semester,
                        GROUP_CONCAT(DISTINCT sp.course_code) AS pre_requisite,
                        GROUP_CONCAT(DISTINCT sc.course_code) AS co_requisite
                  FROM curriculum_subjects AS cs
                  INNER JOIN subject AS s ON cs.subject_id = s.id
                  LEFT JOIN pre_requisites AS pr ON cs.id = pr.curr_subject_id
                  LEFT JOIN co_requisites AS cr ON cs.id = cr.curr_subject_id
                  LEFT JOIN subject AS sp ON pr.pre_requisite_id = sp.id
                  LEFT JOIN subject AS sc ON cr.co_requisite_id = sc.id
                  WHERE cs.curr_id=? AND cs.curr_ver=?
                  GROUP BY cs.id";
      $params = [$curriculumID, $curriculumVersion];
      $subjects = executeQuery($query, $params);

      $resultData['subjects'] = $subjects->fetch_all(MYSQLI_ASSOC);
      echo json_encode($resultData);

   } else {
      http_response_code(404);
   }
}
