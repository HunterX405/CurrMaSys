<?php
// Accessing the variables and other data from the database.php
include_once("database.php");
// Reading the data from the HttpRequest or the Service 
$postData = file_get_contents("php://input");
// Decodes the JSON from the @postData
$request = json_decode($postData);

// To check the $postData
if (isset($postData) && !empty($postData)) {
    // The $request->email or $request->password depends on the HttpRequest from the service. This is based on the credentials variable on api.service.ts 
    
    $email = mysqli_real_escape_string($mysqli, trim($request->email));
    $password = mysqli_real_escape_string($mysqli, trim($request->password));

    // Query to access the table on the database
    $sql = "SELECT * FROM users where email='$email' and password='$password'";

    if ($result = mysqli_query($mysqli, $sql)) {
        // Successful query that returns an array
        $rows = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }
        // Encodes the array in JSON and sent response to the client
        echo json_encode($rows);
    } else {
        http_response_code(404);
    }
}
