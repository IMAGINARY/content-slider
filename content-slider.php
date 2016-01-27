<?php
    $day_of_week = date( 'l' );
    switch( $day_of_week )
    {
        case "Monday": // monday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[0][2] = "app1.inc";
            $content[1][0] = "app1.inc";
            $content[1][1] = "app2.inc";
            $content[1][2] = "app3.inc";
            break;
        case "Tuesday": // tuesday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[1][0] = "app1.inc";
            $content[1][1] = "app2.inc";
            $content[1][2] = "app3.inc";
            break;
        case "Wednesday": // wednesday
            $content[0][0] = "app3.inc";
            $content[1][0] = "app1.inc";
            break;
        case "Thursday": // thursday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[0][2] = "app1.inc";
            $content[1][0] = "app1.inc";
            break;
        case "Friday": // friday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[0][2] = "app1.inc";
            $content[1][0] = "app1.inc";
            $content[1][1] = "app2.inc";
            $content[1][2] = "app3.inc";
            break;
        case "Saturday": // saturday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[0][2] = "app1.inc";
            $content[1][0] = "app1.inc";
            $content[1][1] = "app2.inc";
            $content[1][2] = "app3.inc";
            break;
        case "Sunday": // sunday
            $content[0][0] = "app3.inc";
            $content[0][1] = "app2.inc";
            $content[1][0] = "app1.inc";
            $content[1][1] = "app2.inc";
            $content[1][2] = "app3.inc";
        case "Test":
            $content[0][0] = "app4.inc";
            $content[0][1] = "app3.inc";
            $content[0][2] = "app3.inc";
            $content[1][0] = "app3.inc";
            $content[1][1] = "app3.inc";
            $content[1][2] = "app3.inc";
            break;
    }
?>
<!DOCTYPE html>
<?php echo "<!-- {$day_of_week} -->\n"; ?>
<html>
    <head>
    	<meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    	<title>Content Slider</title>
    	<link rel="stylesheet" href="css/style.css">
        <script src="js/jssor.slider.min.js"></script>
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

        jssor_top_slider_starter = function (containerId) {
            var options = {
                $AutoPlay: true,
                $DragOrientation: 0,
            };
            var jssor_slider = new $JssorSlider$(containerId, options);
        };
        jssor_app_slider_starter = function (containerId) {
                var options = {
                    $AutoPlay: false,
                    $PauseOnHover: 1,
                    $Idle: 3 * 60 * 1000,
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
                console.log(container);

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
                        slide_restart_timer = window.setTimeout( slide_restart_handler, 10 * 1000 );
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
                return jssor_slider;
            };
        </script>
    </head>

    <body id="home" oncontextmenu="return false;" ontouchstart="return false;">

        <div class="page_header">
            <h1>Page title</h1>
        </div>

        <div id="slider_top" class="top_slider">
            <!-- Slides Container -->
            <div u="slides" class="top_slider_slides">
                <div>Motivating text 1</div>
                <div>Motivating text 2</div>
                <div>Motivating text 3</div>
            </div>
            <!-- Trigger -->
            <script>jssor_top_slider_starter('slider_top');</script>
        </div>

<?php
for( $s = 0; $s < 2; $s++ ) {
    echo "\t\t<div id=\"slider{$s}_container\" class=\"content_slider{$s}\">\n";
?>
            <!-- Slides Container -->
            <div class="app_wrapper_bg">
                <!-- ensure bg color between slides -->
            </div>
<?php
echo "\t\t\t<div u=\"slides\" id=\"slides{$s}\" class=\"app_wrapper\">\n";
echo "\t\t\t\t<script>\n";
echo "\t\t\t\t\tcontent_slides[{$s}] = [];\n";
echo "\t\t\t\t\tvar current_content_slides = content_slides[{$s}];\n";
echo "\t\t\t\t</script>\n";
for( $i = 0; $i < count( $content[ $s ] ); $i++ ) {
    echo "\t\t\t\t<div>\n";

    // buffer output and indent
    ob_start();
    include( $content[ $s ][ $i ] );
    $result = ob_get_contents();
    ob_end_clean();
    print str_replace( "\n", "\n\t\t\t\t\t", "\t\t\t\t\t" . trim( $result ) );

    echo "\n\t\t\t\t</div>\n";
}
?>
            </div>

            <!--#region Bullet Navigator Skin Begin -->
            <!-- Help: http://www.jssor.com/development/slider-with-bullet-navigator-jquery.html -->
            <!-- bullet navigator container -->
            <div u="navigator" class="jssorb10" style="bottom: -200px;">
                <!-- bullet navigator item prototype -->
                <div u="prototype"></div>
            </div>
            <!--#endregion Bullet Navigator Skin End -->

            <!--#region Arrow Navigator Skin Begin -->
            <!-- Help: http://www.jssor.com/development/slider-with-arrow-navigator-jquery.html -->
            <!-- Arrow Left -->
            <div u="arrowleft" class="jssor_arrow" style="left:0px;">
                <svg width="110" height="700" class="svg_arrow" style="transform: rotate(180deg);">
                    <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline" />
                </svg>
            </div>
            <!-- Arrow Right -->
            <div u="arrowright" class="jssor_arrow" style="right:0px;">
                <svg width="110" height="700" class="svg_arrow">
                    <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline" />
                </svg>
            </div>
            <!--#endregion Arrow Navigator Skin End -->

        </div>
<?php
    echo "\t\t<script>\n";
    echo "\t\t\tcontent_sliders[{$s}] = jssor_app_slider_starter('slider{$s}_container');\n";
    echo "\t\t</script>\n";
    echo "\t\t<br />\n";
}
?>
    <div class="page_footer">
        Page footer
    </div>
    </body>
</html>
