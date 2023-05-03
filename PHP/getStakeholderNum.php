<?php
// Retreving all the data of Stakeholder Accounts
include_once("database.php");

$query = "SELECT COUNT(id) FROM users where userType = 'stakeholder' AND isActive=1";
$result = executeCountQuery($query);

if ($result) {
    echo json_encode(["stakeholdersCount" => $result]);
} else {
    http_response_code(404);
}
