<?php
  include_once("database.php");

  $query = "SELECT s.id, s.course_code, s.title, s.syllabus,
                    GROUP_CONCAT(DISTINCT e.track) AS electives_track,
                    GROUP_CONCAT(DISTINCT e.elective_title) AS electives_title,
                    GROUP_CONCAT(DISTINCT e.elective_syllabus) AS electives_syllabus
             FROM subject AS s
             LEFT JOIN elective AS e ON s.id = e.fk_subject_id
             GROUP BY s.id";

  $result = executeQuery($query);

  if ($result) {
      $resultData = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode(["subjects" => $resultData]);
  } else {
      http_response_code(404);
  }
