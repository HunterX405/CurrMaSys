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

    if ($haveSubmitted === true) {
        // IF user have already submitted, use UPDATE Query
        $query = "UPDATE vote SET is_approved=?, comment=? WHERE fk_vote_user_id=? AND fk_vote_curr_id=? AND curr_ver=?";

        $params = [$isApproved, $comment, $userID, $currID, $currVer];

        $result = executeQuery($query, $params);
    } else {
        // IF user have not submitted, use INSERT Query
        $query = "INSERT INTO vote (is_approved, comment, fk_vote_user_id, fk_vote_curr_id, curr_ver) VALUES (?,?,?,?,?)";

        $params = [$isApproved, $comment, $userID, $currID, $currVer];

        $result = executeQuery($query, $params);
    }


    // Change curriculum status

    // Get number of stakeholders
    $query = "SELECT Count(id) FROM users WHERE userType = 'stakeholder'";
    $stakeholderCount = executeCountQuery($query);

    // Get number of submitted feedback for the curriculum
    $query = "SELECT Count(id) FROM vote WHERE fk_vote_curr_id=? AND curr_ver=?";
    $params = [$currID, $currVer];
    $feedbackCount = executeCountQuery($query, $params);

    if ($feedbackCount >= ($stakeholderCount / 2)) {
        // Check if there is a returned feedback for the curriculum
        $query = "SELECT Count(id) FROM vote WHERE fk_vote_curr_id=? AND curr_ver=? AND is_approved=0";
        $params = [$currID, $currVer];
        $returnFeedbackCount = executeCountQuery($query, $params);

        if ($returnFeedbackCount > 0) {
            // Update the curriculum status to returned if there is at least 1 return feedback
            $query = "UPDATE curriculum SET curr_status='returned' WHERE id=? AND version_id=?";
        } else {
            // Update the curriculum status to approved if all submitted feedbacks for the curriculum is approved
            $query = "UPDATE curriculum SET curr_status='approved' WHERE id=? AND version_id=?";
        }
    } else {
        // Revert the curriculum status back to pending if majority of the stakeholders has not submitted their feedback yet
        $query = "UPDATE curriculum SET curr_status='pending' WHERE id=? AND version_id=?";
    }

    // Execute query for UPDATE curriculum status
    $params = [$currID, $currVer];
    $result = executeQuery($query, $params);

    $authdata = [
        "isApproved" => $isApproved,
        "comment" => $comment,
        "userID" => $userID,
        "currID" => $currID,
        "stakeholders" => $stakeholderCount,
        "feedbacks" => $feedbackCount,
    ];
    echo json_encode($authdata);
}
