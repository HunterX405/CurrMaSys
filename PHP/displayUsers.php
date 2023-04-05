<?php
  include_once("database.php");

  $resultData = [];
  // Selecting all properties of the table users
  $sql = "SELECT * FROM users";

  if ($result = mysqli_query($mysqli, $sql)) {
    $i = 0;
    // The data that will be returned
    while ($dbRow = mysqli_fetch_assoc($result)) {
      $resultData[$i]["id"] = $dbRow["id"];
      $resultData[$i]["name"] = $dbRow["name"];
      $resultData[$i]["email"] = $dbRow["email"];
      $resultData[$i]["isActive"] = $dbRow["isActive"];

      if ($dbRow["isActive"] === "1") {
        $resultData[$i]["isActive"] = "Active";
      } elseif ($dbRow["isActive"] === "0") {
        $resultData[$i]["isActive"] = "Inactive";
      }


      // Transforming the data for display
      if ($dbRow["userType"] === "admin") {
        $resultData[$i]["userType"] = "Admin";
      } elseif ($dbRow["userType"] === "chair") {
        $resultData[$i]["userType"] = "Committee Chair";
      } elseif ($dbRow["userType"] === "member") {
        $resultData[$i]["userType"] = "Committee Member";
      } elseif ($dbRow["userType"] === "stakeholder") {
        $resultData[$i]["userType"] = "Stakeholder";
      }
      $i++;
    }
    // Returns an array
    echo json_encode(["data" => $resultData]);
  } else {
    http_response_code(404);
  }
?>
