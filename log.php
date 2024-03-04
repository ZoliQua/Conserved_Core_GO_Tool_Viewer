<?php
// Conserved Core GO_TOOL - LOG FILE

// Get visitor's IP address. Considering the possibility of the visitor being behind a proxy
$ip = $_SERVER['REMOTE_ADDR'];
if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
    $ip = array_pop(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
}

// Get visitor's browser information
$browser = $_SERVER['HTTP_USER_AGENT'];

// Create a string to log
$logString = date("Y-m-d H:i:s") . " - IP: " . $ip . " - Browser: " . $browser . "\n";

// Specify the file path
$filePath = "logs/visitors.log";

// Append the logString to the file
file_put_contents($filePath, $logString, FILE_APPEND);

?>