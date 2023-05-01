<?php
// To access all feedbacks based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    $curriculumID = $request->currID;
    $curriculumVer = $request->currVer;
    $userId = $request->userId;

    // Query that accesses the VOTE, CURRICULUM and USERS Table
    $query = "SELECT vote.is_approved, vote.comment
                FROM vote
                WHERE fk_vote_curr_id=? AND curr_ver=? AND fk_vote_user_id=?";

    $params = [$curriculumID, $curriculumVer, $userId];

    $result = executeQuery($query, $params);

    if ($result) {
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    } else {
        http_response_code(404);
    }
}
