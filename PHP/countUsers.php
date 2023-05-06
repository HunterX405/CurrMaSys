<?php
include_once("database.php");

$userTypes = array("admin", "chair", "stakeholder", "member");
$count = array();

foreach ($userTypes as $userType) {
  $sql = "SELECT COUNT(id) FROM users WHERE userType=?";
  $params = [$userType];
  $count[$userType] = executeCountQuery($sql, $params);
}

echo json_encode($count);