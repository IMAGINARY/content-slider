<?php
/******************************
 * BEGIN configuration
 ******************************/
// all time units are in seconds

// show or hide cursor
$hide_cursor = true;

// stop propagation of all types of mouse events at document.body
$disable_mouse_events = false;

// disable console logging
$disable_console_logging = true;

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

// touch overlay debugging features
$debugging_enabled = false;
$debug_cursor_scale = 1;

// touch cursor visualization
$touch_cursor_visible = true;
$touch_cursor_html = '<svg width="21" height="21" style="transform: translate(-50%, -50%);"><circle cx="11" cy="11" r="9" stroke="white" stroke-width="3.5" fill="none" /><circle cx="11" cy="11" r="9" stroke="black" stroke-width="1" fill="red" /></svg>';

/******************************
 * END configuration
 ******************************/

// load local config file, if it exists.
// missing config.local.inc is ok.
// allows to overwrite config values with local
// values that are not stored in the VCS
// (e.g. via .gitignore).
if( file_exists( 'config.local.inc' ) )
    include( 'config.local.inc' );

?>
