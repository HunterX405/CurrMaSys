<?php
// Retreving all the data of Stakeholder Accounts
include_once("database.php");

$query = "SELECT vote.fk_vote_curr_id, vote.is_approved, curriculum.id,         curriculum.version 
FROM vote 
INNER JOIN curriculum 
ON vote.fk_vote_curr_id = curriculum.id";

$result = executeQuery($query);

if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["status" => $resultData]);
} else {
    http_response_code(404);
}
