<?php
include_once("database.php");

// $query = "SELECT * FROM curriculum WHERE date_and_time = (SELECT MAX(date_and_time) FROM curriculum) AND curr_status = 'approved'";

$query = "SELECT * FROM curriculum 
    WHERE date_and_time = (
    SELECT MAX(date_and_time) 
    FROM curriculum 
    WHERE curr_status = 'approved' 
    LIMIT 1
) 
AND curr_status = 'approved'";

$result = executeQuery($query);

if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["curriculum" => $resultData]);
} else {
    http_response_code(404);
}
