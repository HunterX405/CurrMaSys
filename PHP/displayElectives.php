<?php
include_once("database.php");

// Query for getting data from the SUBJECT and ELECTIVE using the JOIN function
// Using the fk_subject_id to access data on both SUBJECT and ELECTIVE tables
$query = "SELECT elective.id, elective.track, elective.elective_title, elective.elective_syllabus, elective.fk_subject_id, subject.course_code, subject.title FROM elective INNER JOIN subject ON elective.fk_subject_id = subject.id";

$result = executeQuery($query);

if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["electives" => $resultData]);
} else {
    http_response_code(404);
}
