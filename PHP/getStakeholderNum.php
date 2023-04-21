<?php
// Retreving all the data of Stakeholder Accounts
include_once("database.php");

$query = "SELECT id, name FROM users where userType = 'stakeholder'";

$result = executeQuery($query);

if ($result) {
    $resultData = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["stakeholders" => $resultData]);
} else {
    http_response_code(404);
}
