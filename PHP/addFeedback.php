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
    $haveSubmitted = $request->haveSubmitted;
    $message = "";

    
    if ($haveSubmitted === true) {
        // IF user have already submitted, use UPDATE Query
        $query = "UPDATE vote SET is_approved=?, comment=? WHERE fk_vote_user_id=? AND fk_vote_curr_id=?";

        $params = [$isApproved, $comment, $userID, $currID];

        $result = executeQuery($query, $params);
    } else {
        // IF user have not submitted, use INSERT Query
        $query = "INSERT INTO vote (is_approved, comment, fk_vote_user_id, fk_vote_curr_id) VALUES (?,?,?,?)";

        $params = [$isApproved, $comment, $userID, $currID];

        $result = executeQuery($query, $params);
    }

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
