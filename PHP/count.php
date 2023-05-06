<?php
include_once("database.php");

$tables = array("users", "subject", "elective");
$count = array();

foreach ($tables as $table) {
    $sql = "SELECT COUNT(id) FROM $table";
    $count[$table] = executeCountQuery($sql);
}
echo json_encode($count);