<?php
    /************************************?
     * Simple app viewer showing one applet at a time
     ************************************/
    require( 'config.inc' );

    $apps = [];
    foreach (glob("app*.inc") as $filename)
    {
        if( $filename != "app_common.inc" )
            $apps[] = $filename;
    }

    if( isset($_GET["app"]) )
        $content = $_GET["app"];

    if( !in_array( $content, $apps ) )
    {
        header("Location: ?app=$apps[0]");
        exit;
    }
?>
<!DOCTYPE html>
<html>
    <head>
    	<meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    	<title>Content Slider</title>
    	<link rel="stylesheet" href="css/viewer.css">
<?php
        {
            $tab = '    ';
            $ind7n = str_repeat( $tab, 2 );
            echo $ind7n."<!-- BEGIN common app header -->\n";
            // buffer output and indent
            ob_start();
            include( 'app_common.inc' );
            $result = ob_get_contents();
            ob_end_clean();
            print str_replace( "\n", "\n".$ind7n , $ind7n.trim( $result ) )."\n";
            echo $ind7n."<!-- END common app header -->\n";
        }
?>
        <script src="js/jssor.slider.min.js"></script>
<?php if( $disable_console_logging ) : ?>
        <script src="js/dummy-console.js"></script>
<?php endif ?>
        <script>
            var content_sliders = [];
            var content_slides = [];

            function refreshAt(hours, minutes, seconds) {
                var now = new Date();
                var then = new Date();

                if(now.getHours() > hours ||
                   (now.getHours() == hours && now.getMinutes() > minutes) ||
                    now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
                    then.setDate(now.getDate() + 1);
                }
                then.setHours(hours);
                then.setMinutes(minutes);
                then.setSeconds(seconds);

                var timeout = (then.getTime() - now.getTime());
                setTimeout(function() { window.location.reload(true); }, timeout);
            }
            refreshAt( 0, 0, 0 );

            function simple_fade_slider(containerID) {

                var slides = document.getElementById(containerID).children[0].children;
                var currSlide = 0;
                function rotateSlide() {
                    slides[currSlide].classList.remove('active');
                    currSlide++;
                    if(currSlide >= slides.length) {
                        currSlide = 0;
                    }
                    slides[currSlide].classList.add('active');
                }
                setInterval(function(){
                    rotateSlide();
                }, 10000);
                rotateSlide();
            }

            jssor_app_slider_starter = function (containerId) {
                var options = {
                    $AutoPlay: false,
                    $PauseOnHover: 0,
                    $Idle: (<?=$auto_slide_delay ?>) * 1000,
                    $DragOrientation: 0,
                    $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
                        $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
                        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                        $AutoCenter: 1,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                        $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
                        $Rows: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
                        $SpacingX: 30,                                  //[Optional] Horizontal space between each item in pixel, default value is 0
                        $SpacingY: 10,                                  //[Optional] Vertical space between each item in pixel, default value is 0
                        $Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
                    },
                    $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
                        $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                        //$AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                        $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
                    }
                };

                var container = document.getElementById( containerId );

                container.addEventListener('mouseup', non_idle_handler, true);
                container.addEventListener('mousemove', non_idle_handler, true);
                container.addEventListener('mousedown', non_idle_handler, true);
                container.addEventListener("touchstart", non_idle_handler, true);
                container.addEventListener("touchend", non_idle_handler, true);
                container.addEventListener("touchcancel", non_idle_handler, true);
                container.addEventListener("touchmove", non_idle_handler, true);

                // implemented idle timeout myself since JSSOR idle mode does not
                // reset the timeout on interruption
                var idle_timer = null;
                function init_idle_timer()
                {
                    if( idle_timer != null )
                        clearTimeout( idle_timer );
                    idle_timer = setTimeout( idle_handler, options.$Idle );
                }
                function non_idle_handler( evt ) {
                    console.log("non_idle_handler");
                    init_idle_timer();
                }
                function idle_handler() {
                    console.log("idle_handler");
                    jssor_slider.$Next();
                    init_idle_timer();
                }
                init_idle_timer();

                var jssor_slider = new $JssorSlider$(containerId, options);
                var slides = current_content_slides
                var slide_restart_timer = null;
                jssor_slider.$On( $JssorSlider$.$EVT_PARK, function( slideIndex, fromIndex ) {
                    for( i = 0; i < slides.length; i++ )
                    {
                        if( i == slideIndex )
                            slides[ i ].resume();
                        else
                            slides[ i ].pause();
                        if( slide_restart_timer !== null )
                            window.clearTimeout( slide_restart_timer );
                        slide_restart_timer = window.setTimeout( slide_restart_handler, (<?=$app_restart_delay ?>) * 1000 );
                    }
                } );
                function slide_restart_handler() {
                    if( !jssor_slider.$IsSliding() )
                    {
                        for( i = 0; i < slides.length; i++ )
                        {
                            if( i != jssor_slider.$CurrentIndex() )
                                slides[ i ].restart( true );
                        }
                    }
                }

                // only fire if touch ended on a node that is equal to or is a child node of element
                jssor_slider.fix_touchend_action = function( event, element, action, preventDefault ) {
                    var changedTouch = event.changedTouches[ 0 ];
                    var elementBelow = document.elementFromPoint( changedTouch.clientX, changedTouch.clientY );

                    while( elementBelow != null && elementBelow != element )
                        elementBelow = elementBelow.parentElement;

                    if( elementBelow == element )
                    {
                        action();
                        if( preventDefault )
                            event.preventDefault();
                    }
                }

                // just put this function into the event loop to be executed
                // at ANY LATER TIME BUT NOT NOW
                window.setTimeout( function() {
                    // restart all slides, but resume only slide 0
                    for( i = 0; i < slides.length; i++ )
                        slides[ i ].restart( true );
                    slides[ 0 ].resume();
                }, <?=($fadein_on_load_delay < 1 ? 1 : $fadein_on_load_delay ) ?> * 750 );

                return jssor_slider;
            };
        </script>
    </head>

    <body
        id="home"
        reload-delay="<?=$reload_delay ?>"
        idle-delay="<?=$idle_delay ?>"
        heartbeat-interval="<?=$heartbeat_interval ?>"
        heartbeat-url="<?=$heartbeat_url?>"
        fadein-on-load-delay="<?=$fadein_on_load_delay?>"
        reload-button-size="<?=$reload_button_size ?>"
        reload-button-hold-time="<?=$reload_button_hold_time ?>"
        debug-cursor-scale="<?=$debug_cursor_scale ?>"
        touch-cursor-html="<?=htmlspecialchars( $touch_cursor_html, ENT_QUOTES, false ) ?>"

        oncontextmenu="return false;"
        ontouchstart="return false;"
        class="noselect"
        style="<?php
            if( $hide_cursor ) echo "cursor: none;";
            if( $disable_scrolling ) echo "overflow: hidden;";
        ?>"
    >
<?php if( $disable_mouse_events ) : ?>
            <script src="js/stop-mouse-event-propagation.js"></script>
<?php endif ?>
        <div
            id="wrapper"
            class="fade-in"
            animationend="wrapper.classList.remove( 'fade-in' ); wrapper.style.animation = 'none';"
            style="animation-delay: <?=$fadein_on_load_delay ?>s;"
        >

                <div class="app_viewer">
                    <script>
                        var current_content_slides = [];
                    </script>

<?php
                    $tab = '    ';
                    $ind7n = str_repeat( $tab, 4 );
                    echo $ind7n."<div>\n";
                    // buffer output and indent
                    ob_start();
                    include( $content );
                    $result = ob_get_contents();
                    ob_end_clean();
                    print str_replace( "\n", "\n".$tab.$ind7n , $tab.$ind7n.trim( $result ) )."\n";
                    echo $ind7n."</div>\n";
?>
                </div>

                <script>
                    //content_sliders[<?=$s?>] = jssor_app_slider_starter('slider<?=$s?>_container');
                    window.setTimeout( function() { var c = current_content_slides[ 0 ]; c.restart( true ); c.resume(); }, <?=($fadein_on_load_delay < 1 ? 1 : $fadein_on_load_delay ) ?> * 750 );
                </script>

                <div class="available_apps">
                    Available applets:
<?php
                    $tab = '    ';
                    $ind7n = str_repeat( $tab, 5 );
                    foreach( $apps as $app )
                    {
                        $app_name = preg_replace( array('/^app/','/.inc$/'), array('',''), $app );
                        echo $ind7n."<a href=\"?app=$app\">$app_name</a>".($app!=end($apps)?', ':'')."\n";
                    }
?>
                </div>
            </div>

            <script src="js/auto-page-reloader.js"></script>
<?php if( $heartbeat_enabled ) : ?>
            <script src="js/heartbeat.js"></script>
<?php endif ?>
<?php if( $debugging_enabled ) : ?>
            <script src="js/debug-overlay.js"></script>
<?php endif ?>
<?php if( $touch_cursor_visible ) : ?>
            <script src="js/touch-cursor.js"></script>
<?php endif ?>
        <div>
    </body>
</html>
