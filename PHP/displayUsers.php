<?php
include_once("database.php");

$users = [];
// Selecting all properties of the table users
$sql = "SELECT * FROM users";

if ($result = mysqli_query($mysqli, $sql)) {
    $i = 0;
    // The data that will be returned
    while ($row = mysqli_fetch_assoc($result)) {
        $users[$i]["name"] = $row["name"];
        $users[$i]["email"] = $row["email"];
        // Transforming the data for display
        if ($row["userType"] === "admin") {
            $users[$i]["userType"] = "Admin";
        } elseif ($row["userType"] === "chair") {
            $users[$i]["userType"] = "Committee Chair";
        } elseif ($row["userType"] === "member") {
            $users[$i]["userType"] = "Committee Member";
        } elseif ($row["userType"] === "stakeholder") {
            $users[$i]["userType"] = "Stakeholder";
        }
        $i++;
    }
    // Returns an array
    echo json_encode(["data" => $users]);
} else {
    http_response_code(404);
}
