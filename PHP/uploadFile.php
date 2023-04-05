<?php
include_once("database.php");
// Moving the uploaded PHP File on form to the PDF Folder (Located inside the PHP Folder)
$target_dir =  "PDF/";
$target_file = $target_dir . basename($_FILES["myFile"]["name"]);
move_uploaded_file($_FILES["myFile"]["tmp_name"], $target_file);
