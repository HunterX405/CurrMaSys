<?php
// Adds feedback on the database
include_once("database.php");

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $comment = trim($request->comment);
    $isApproved = $request->isApproved;
    $userID = $request->userId;
    $currID = $request->currId;
    $currVer = $request->currVer;
    $haveSubmitted = $request->haveSubmitted;

    $status = 'unchanged';

    if ($haveSubmitted === true) {
        // IF user have already submitted, use UPDATE Query
        $status = 'Updated';
        $query = "UPDATE vote SET is_approved=?, comment=? WHERE fk_vote_user_id=? AND fk_vote_curr_id=? AND curr_ver=?";
    } else {
        $status = 'Added';
        // IF user have not submitted, use INSERT Query
        $query = "INSERT INTO vote (is_approved, comment, fk_vote_user_id, fk_vote_curr_id, curr_ver) VALUES (?,?,?,?,?)";
    }

    $params = [$isApproved, $comment, $userID, $currID, $currVer];
    $result = executeQuery($query, $params);

    echo json_encode(array('status' => $status));
}
