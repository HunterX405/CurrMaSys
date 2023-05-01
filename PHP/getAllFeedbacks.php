<?php
include_once("database.php");

if (isset($_GET['u'])) {
    $user = $_GET['u'];
    $query = "SELECT c.id, c.department, c.version, c.date_and_time, c.version_id, v.is_approved
            FROM curriculum AS c
            LEFT JOIN vote AS v ON c.id = v.fk_vote_curr_id AND c.version_id = v.curr_ver AND v.fk_vote_user_id = ?";
    $params = [$user];

    $result = executeQuery($query,$params);

    if ($result) {
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    } else {
        http_response_code(404);
    }
} else {
    http_response_code(404);
}
