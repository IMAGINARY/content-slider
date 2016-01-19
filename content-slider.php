<?php
    $day_of_week = date( 'l' );
    echo "<!-- {$day_of_week} -->\n";
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
            break;
    }
?>
<!DOCTYPE html>
<html>
    <head>
    	<meta charset="utf-8">
    	<title>Content Slider</title>
    	<link rel="stylesheet" href="css/style.css">
        <script src="js/jssor.slider.min.js"></script>
        <script>
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
                var jssor_slider = new $JssorSlider$(containerId, options);
            };
        </script>
    </head>

    <body id="home">

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
            <div u="slides" class="app_wrapper">
<?php for( $i = 0; $i < count( $content[ $s ] ); $i++ ) { ?>
                <div>
<?php include( $content[ $s ][ $i ] ); ?>
                </div>
<?php } ?>
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
    echo "\t\t\tjssor_app_slider_starter('slider{$s}_container');\n";
    echo "\t\t</script>\n";
    echo "\t\t<br />\n";
}
?>
    <div class="page_footer">
        Page footer
    </div>
    </body>
</html>
