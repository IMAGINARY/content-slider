<?php
/******************************
 * BEGIN configuration
 ******************************/
// all time units are in seconds

// variables subject to automatic page reload
$fadein_on_load_delay = 15;
$reload_delay = 3 * 60 * 60;
$idle_delay = 15;

// variables subject to sliders
$auto_slide_delay = 3 * 60;
$app_restart_delay = 10;

// variables subject to heartbeat
$heartbeat_interval = 2;
$heartbeat_url = 'http://localhost:8081/heartbeat';
$heartbeat_respawn_delay = 10;

// variables subject to the launch script and built-in web server
$server_host = 'localhost';
$server_port = 8081;
$content_slider_url = 'http://localhost:8081/index.php';
$web_browser_cmd = "electron '".__DIR__."/electron-app' -l {$content_slider_url} > /dev/null 2>&1";
$timestamp_file = 'timestamp';

/******************************
 * END configuration
 ******************************/
?>
