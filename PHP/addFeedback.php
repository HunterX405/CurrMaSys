<?php
// Adds feedback on the database
include_once("database.php");

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $comment = trim($request->comment);
    $isApproved = $request->isApproved;
    $userID = $request->userID;
    $currID = $request->currID;

    $query = "INSERT INTO vote (is_approved, comment, fk_vote_user_id, fk_vote_curr_id) VALUES (?,?,?,?)";

    $params = [$isApproved, $comment, $userID, $currID];

    $result = executeQuery($query, $params);

    if ($result) {
        $authdata = [
            "isApproved" => $isApproved,
            "comment" => $comment,
            "userID" => $userID,
            "currID" => $currID,
        ];
        echo json_encode($authdata);
    }
}
