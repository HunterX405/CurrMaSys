<?php
// To access all data based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    $curriculumID = $request->currID;

    $query = "SELECT * FROM curriculum WHERE id=?";

    $params = [$curriculumID];

    $result = executeQuery($query, $params);

    if ($result) {
        $resultData = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($resultData);
    } else {
        http_response_code(404);
    }
}
