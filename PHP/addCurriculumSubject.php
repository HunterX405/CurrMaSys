<?php
$subject_id = mysqli_insert_id($mysqli);
        foreach ($prerequisites as $prerequisite) {
          $query = "INSERT INTO prerequisites(subject_id, prerequisite_id) VALUES (?, ?)";
          $params = [$subject_id, $prerequisite];
          executeQuery($query, $params);
        }
