<?php
include_once("database.php");

$query = "SELECT * FROM curriculum";

$result = executeQuery($query);

if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["curriculums" => $resultData]);
} else {
    http_response_code(404);
}
