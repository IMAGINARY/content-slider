<?php
/******************************
 * BEGIN configuration
 ******************************/
// all time units are in seconds

// show or hide cursor
$hide_cursor = true;

// disable scrolling
$disable_scrolling = true;

// variables subject to (automatic) page reload
$fadein_on_load_delay = 15;
$reload_delay = 3 * 60 * 60;
$idle_delay = 15;
$reload_button_size = '40px';
$reload_button_hold_time = 5;

// variables subject to sliders
$auto_slide_delay = 3 * 60;
$app_restart_delay = 10;

// variables subject to heartbeat
$heartbeat_enabled = true;
$heartbeat_interval = 2;
$heartbeat_url = 'http://localhost:8081/heartbeat';
$heartbeat_respawn_delay = 10;

// variables subject to the launch script and built-in web server
$server_host = 'localhost';
$server_port = 8081;
$content_slider_url = 'http://localhost:8081/index.php';
$web_browser_cmd = "electron --set-base-background-color=0xFF000000 '".__DIR__."/electron-app' -l {$content_slider_url} > /dev/null 2>&1";
$timestamp_file = 'timestamp';

// which page to use for the animation in the background (runs in an iframe)
// currently available: bg_webgl.html, bg_svg.html, bg_plain.html
$background_animation_url='bg_svg.html';

/******************************
 * END configuration
 ******************************/
?>
