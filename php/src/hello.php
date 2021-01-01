<?php
header_remove();
header('Content-Type: text/plain');
echo 'Hello ' . htmlspecialchars($_GET["name"]);
?>