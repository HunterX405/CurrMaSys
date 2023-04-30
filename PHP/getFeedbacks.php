<?php
// To access all feedbacks based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    $curriculumID = $request->currID;
    $curriculumVer = $request->currVer;

    // Query that accesses the VOTE, CURRICULUM and USERS Table
    $query = "SELECT
    vote.is_approved, vote.comment, vote.fk_vote_user_id, vote.fk_vote_curr_id,
    users.name, users.email
    FROM vote
    INNER JOIN users ON vote.fk_vote_user_id = users.id
    WHERE fk_vote_curr_id=? AND curr_ver=?";

    $params = [$curriculumID, $curriculumVer];

    $result = executeQuery($query, $params);

    if ($result) {
        $resultData = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["feedbacks" => $resultData]);
    } else {
        http_response_code(404);
    }
}
