<?php
$db = new SQLite3('todo_db');
$result = $db->query('SELECT id, title, image_path FROM advertisements');
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    echo "ID: " . $row['id'] . ", Title: " . $row['title'] . ", Path: " . $row['image_path'] . PHP_EOL;
}
$db->close();
