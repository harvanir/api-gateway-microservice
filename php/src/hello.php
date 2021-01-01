<?php
header_remove();
header('Content-Type: text/plain');

$delayStr = $_GET["delay"];

if ($delayStr != null) {
    $delay = intval($delayStr);

    if ($delay > 0) {
        usleep($delay * 1000);
    }
}

echo 'Hello ' . htmlspecialchars($_GET["name"]);
?>