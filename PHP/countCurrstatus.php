<?php
include_once("database.php");

$currStatus = array("approved", "returned", "pending");
$count = array();

foreach ($currStatus as $currStat) {
    $sql = "SELECT COUNT(id) FROM curriculum WHERE curr_status=?";
    $params = [$currStat];
    $count[$currStat] = executeCountQuery($sql, $params);
}

echo json_encode($count);