<?php
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    // Get Curriculum details
    $currID = $request->currID;
    $currVer = $request->currVer;

    // Check if status was changed
    $status = 'unchanged';

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
            $status = 'returned';
            $query = "UPDATE curriculum SET curr_status='returned' WHERE id=? AND version_id=?";
        } else {
            // Update the curriculum status to approved if all submitted feedbacks for the curriculum is approved
            $status = 'approved';
            $query = "UPDATE curriculum SET curr_status='approved' WHERE id=? AND version_id=?";
        }
    } else {
        // Revert the curriculum status back to pending if majority of the stakeholders has not submitted their feedback yet
        $status = 'pending';
        $query = "UPDATE curriculum SET curr_status='pending' WHERE id=? AND version_id=?";
    }

    // Execute query for UPDATE curriculum status
    $params = [$currID, $currVer];
    $result = executeQuery($query, $params);

    echo json_encode(array('status' => $status));
}
