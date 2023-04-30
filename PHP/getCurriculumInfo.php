<?php
// To access all data based on specific CURRICULUM ID
include_once("database.php");

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (isset($postData) && !empty($postData)) {
    $curriculumID = $request->currID;
    $curriculumVer = $request->currVer;

    $query = "SELECT * FROM curriculum WHERE id=? AND version_id=?";

    $params = [$curriculumID, $curriculumVer];

    $result = executeQuery($query, $params);

    if ($result) {
        $resultData = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($resultData);
    } else {
        http_response_code(404);
    }
}
