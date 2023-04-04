<?php
include_once("database.php");

$target_dir =  "PDF/";
$target_file = $target_dir . basename($_FILES["myFile"]["name"]);
move_uploaded_file($_FILES["myFile"]["tmp_name"], $target_file);
