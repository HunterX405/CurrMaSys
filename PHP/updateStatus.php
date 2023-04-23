<?php
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    $currID = $request->currID;
    $currStatus = trim($request->currStatus);

    $query = "UPDATE curriculum SET curr_status=? WHERE id=?";
    $params = [$currStatus, $currID];

    $result = executeQuery($query, $params);

    try {
        if (executeQuery($query)) {
            http_response_code(200);
            echo json_encode($currStatus);
        } else {
            http_response_code(404);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error updating curriculum: " . $e->getMessage();
    }
}
