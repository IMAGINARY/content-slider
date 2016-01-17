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
            jssor_slider1_starter = function (containerId) {
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
                        $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                        $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
                    }
                };
                var jssor_slider1 = new $JssorSlider$(containerId, options);
            };
        </script>
    </head>

    <body id="home">

        <div class="page_header">
            <h1>Page title</h1>
        </div>
<?php
for( $s = 0; $s < 2; $s++ ) {
    echo "\t\t<div id=\"slider{$s}_container\" class=\"content_slider\">\n";
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
            <style>
                /* jssor slider bullet navigator skin 10 css */
                /*
                .jssorb10 div           (normal)
                .jssorb10 div:hover     (normal mouseover)
                .jssorb10 .av           (active)
                .jssorb10 .av:hover     (active mouseover)
                .jssorb10 .dn           (mousedown)
                */
                .jssorb10 {
                    position: absolute;
                }
                .jssorb10 div, .jssorb10 div:hover, .jssorb10 .av {
                    position: absolute;
                    /* size of bullet elment */
                    width: 30px;
                    height: 30px;
                    border: 3px solid black;
                    border-radius: 50%;
                    background: green;
                    overflow: hidden;
                    cursor: pointer;
                }
                .jssorb10 div { background: red; }
                .jssorb10 div:hover, .jssorb10 .av:hover { background: white; }
                .jssorb10 .av { background: blue; }
                .jssorb10 .dn, .jssorb10 .dn:hover { background: black; }
            </style>
            <!-- bullet navigator container -->
            <div u="navigator" class="jssorb10" style="bottom: 45px;">
                <!-- bullet navigator item prototype -->
                <div u="prototype"></div>
            </div>
            <!--#endregion Bullet Navigator Skin End -->

            <!--#region Arrow Navigator Skin Begin -->
            <!-- Help: http://www.jssor.com/development/slider-with-arrow-navigator-jquery.html -->
            <style>
                /* jssor slider arrow navigator skin 06 css */
                /*
                .jssora06l                  (normal)
                .jssora06r                  (normal)
                .jssora06l:hover            (normal mouseover)
                .jssora06r:hover            (normal mouseover)
                .jssora06l.jssora06ldn      (mousedown)
                .jssora06r.jssora06rdn      (mousedown)
                */

                [class^=jssora06]{  /* Arrows @RCB */
                    /*border:       solid currentColor;*/
                    border:       solid green;
                    border-width: 0 .2em .2em 0;
                    display:      inline-block;
                    padding:      .20em;
                    display: block;
                    position: absolute;
                    /* size of arrow element */
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                    overflow: hidden;

                }
                .jssora06r {transform:rotate(-45deg);}
                .jssora06l  {transform:rotate(135deg);}

                .jssora06l { background-position: -8px -38px; }
                .jssora06r { background-position: -68px -38px; }
                .jssora06l:hover { background-position: -128px -38px; }
                .jssora06r:hover { background-position: -188px -38px; }
                .jssora06l.jssora06ldn { background-position: -248px -38px; }
                .jssora06r.jssora06rdn { background-position: -308px -38px; }
            </style>
            <!-- Arrow Left -->
            <span u="arrowleft" class="jssora06l" style="left: 50px;">
            </span>
            <!-- Arrow Right -->
            <span u="arrowright" class="jssora06r" style="right: 50px;">
            </span>
            <!--#endregion Arrow Navigator Skin End -->

        </div>
<?php
    echo "\t\t<script>\n";
    echo "\t\t\tjssor_slider1_starter('slider{$s}_container');\n";
    echo "\t\t</script>\n";
    echo "\t\t<br />\n";
}
?>
    <div class="page_footer">
        Page footer
    </div>
    </body>
</html>
