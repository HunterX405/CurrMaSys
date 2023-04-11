<?php
include_once("database.php");

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $fkSubjID = $request->fkSubjID;

    // RegEx for matching the C:/fakepath/ on the $request->elData->syllabus
    $pattern = "/^C:\\\\fakepath\\\\/";

    // Accessing the el1Data Object from the service
    $el1Title = trim($request->el1Data->title);
    $el1File = trim($request->el1Data->syllabus);
    // Concatenate a new number and removes unnecessary string using the $pattern (RegEx)
    $newEl1File = rand(1000, 10000) . "-" . preg_replace($pattern, "", $el1File);

    // Accessing the el2Data Object from the service
    $el2Title = trim($request->el2Data->title);
    $el2File = trim($request->el2Data->syllabus);
    $newEl2File = rand(1000, 10000) . "-" . preg_replace($pattern, "", $el2File);

    // Accessing the el3Data Object from the service
    $el3Title = trim($request->el3Data->title);
    $el3File = trim($request->el3Data->syllabus);
    $newEl3File = rand(1000, 10000) . "-" . preg_replace($pattern, "", $el3File);

    $authdata = array($newEl1File, $newEl2File, $newEl3File);

    $query = "INSERT INTO elective (track, elective_title, elective_syllabus, fk_subject_id) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)";

    $params = ["SM", $el1Title, $newEl1File, $fkSubjID, "BA", $el2Title, $newEl2File, $fkSubjID, "WEB", $el3Title, $newEl3File, $fkSubjID];

    $result = executeQuery($query, $params);

    if ($result) {
        // Returning the new file name for each Object.
        // Will be used on the uploadFile service.
        $authdata = [
            $newEl1File,
            $newEl2File,
            $newEl3File
        ];
        echo json_encode($authdata);
    }
}
