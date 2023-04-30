<?php
// To access all data based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
   $curriculumID = $request->currId;
   $curriculumVer = $request->currVer;
   $query = "SELECT * FROM curriculum WHERE id=? AND version_id=?";
   $params = [$curriculumID, $curriculumVer];
   $result = executeQuery($query, $params);

   if ($result) {
      $curriculum = $result->fetch_assoc();
      $resultData['curriculum'] = $curriculum;

      $query = "SELECT s.course_code, s.title, s.id, s.syllabus,
                        cs.lec_units, cs.lab_units, cs.total_units, cs.hrs, cs.year, cs.semester,
                        GROUP_CONCAT(DISTINCT sp.course_code) AS pre_requisite,
                        GROUP_CONCAT(DISTINCT sp.id) AS pre_requisite_id,
                        GROUP_CONCAT(DISTINCT sc.course_code) AS co_requisite,
                        GROUP_CONCAT(DISTINCT sc.id) AS co_requisite_id,
                        GROUP_CONCAT(DISTINCT e.track) AS electives_track,
                        GROUP_CONCAT(DISTINCT e.elective_title) AS electives_title,
                        GROUP_CONCAT(DISTINCT e.elective_syllabus) AS electives_syllabus
                  FROM curriculum_subjects AS cs
                  INNER JOIN subject AS s ON cs.subject_id = s.id
                  LEFT JOIN pre_requisites AS pr ON cs.id = pr.curr_subject_id
                  LEFT JOIN co_requisites AS cr ON cs.id = cr.curr_subject_id
                  LEFT JOIN subject AS sp ON pr.pre_requisite_id = sp.id
                  LEFT JOIN subject AS sc ON cr.co_requisite_id = sc.id
                  LEFT JOIN elective AS e ON s.id = e.fk_subject_id
                  WHERE cs.curr_id=? AND cs.curr_ver=?
                  GROUP BY cs.id";
      $params = [$curriculumID, $curriculumVer];
      $subjects = executeQuery($query, $params);

      $resultData['subjects'] = $subjects->fetch_all(MYSQLI_ASSOC);
      echo json_encode($resultData);

   } else {
      http_response_code(404);
   }
}
