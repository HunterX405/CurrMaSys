<?php
  include_once("database.php");
  // Moving the uploaded PHP File on form to the PDF Folder (Located inside the PHP Folder)
  $target_dir =  "PDF/";
  $target_file = $target_dir . basename($_FILES["file"]["name"]);

  move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);

  $response = array(
    "target_file" => $target_file
  );

  if (isset($_POST['oldFileName'])) {
    $oldFile = $target_dir . $_POST['oldFileName'];
    if(file_exists($oldFile)){
      unlink($oldFile);
      $response['oldFile'] = $oldFile;
    }
  }

  echo json_encode($response);
?>
