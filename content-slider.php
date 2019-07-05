<!DOCTYPE html>
<html>
    <head>
    	<meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    	<title>Content Slider</title>
    	<link rel="stylesheet" href="css/style.css">

        <script src="js/jssor.slider.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.13.1/js-yaml.min.js"></script>
        <script src="js/dummy-console.js"></script>
        <script src="js/stop-mouse-event-propagation.js"></script>
        <script src="js/auto-page-reloader.js"></script>
        <script src="js/heartbeat.js"></script>
        <script src="js/touch-cursor.js"></script>
        <script src="js/debug-overlay.js"></script>

        <script>
            const configPromise = $.get('config.yaml').then(configSrc => jsyaml.safeLoad(configSrc), err => console.log(err));
            $.when(configPromise, $.ready).then(config => {
                console.log(config);

                window.mouseEventSuppressor = new MouseEventSupporessor();
                mouseEventSuppressor.setEnabled(config.disableMouseEvents);

                window.pageReloadButtons = new ReloadButtons({
                    parentElement: document.getElementById('wrapper'),
                    reloadButtonSize: config.reloadButtonSize,
                    reloadButtonHoldTime: config.reloadButtonHoldTime,
                });
                pageReloadButtons.setEnabled(true);

                window.idleReloader = new IdleReloader({
                    reloadDelay: config.reloadDelay,
                    idleDelay: config.idleDelay,
                });
                idleReloader.setEnabled(true);

                window.heartbeat = new HeartBeat(config.heartbeatUrl, config.heartbeatInterval);
                heartbeat.setEnabled(config.heartbeatEnabled);

                const cursorElem = $(config.touchCursorHtml)[0];
                window.cursor = new Cursor({
                    createCursorElement: () => {
                        const cursor = cursorElem.cloneNode(true);
                        cursor.style.opacity = '0.25';
                        return cursor;
                    },
                    downHandler: cursor => cursor.style.opacity = '1.0',
                    upHandler: cursor => cursor.style.opacity = '0.25',
                });
                cursor.setEnabled(config.touchCursorVisible);

                window.debugOverlay = new DebugOverlay({debugCursorScale: config.debugCursorScale});
                debugOverlay.setEnabled(config.debuggingEnabled);

                DummyConsole.setEnabled(config.disableConsoleLogging)
            });
        </script>
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

            function createSlide(app) {
                const slide = document.importNode(document.getElementById('slide_template').content, true);
                slide.querySelector('.app').appendChild(app.domElement);
                slide.querySelector('.app_name').innerHTML = app.name;
                slide.querySelector('.app_description').innerHTML = app.description;
                slide.querySelector('.app_credits').innerHTML = app.credits;
                console.log(slide);
                return slide;
            }

            jssor_app_slider_starter = function (containerId, apps, config) {
                var options = {
                    $AutoPlay: false,
                    $PauseOnHover: 0,
                    $Idle: config.autoSlideDelay * 1000,
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
                var slide_restart_timer = null;
                jssor_slider.$On( $JssorSlider$.$EVT_PARK, function( slideIndex, fromIndex ) {
                    for( i = 0; i < apps.length; i++ )
                    {
                        if( i == slideIndex )
                            apps[ i ].resume();
                        else
                            apps[ i ].pause();
                        if( slide_restart_timer !== null )
                            window.clearTimeout( slide_restart_timer );
                        slide_restart_timer = window.setTimeout( slide_restart_handler, config.appRestartDelay * 1000 );
                    }
                } );

                function slide_restart_handler() {
                    if (!jssor_slider.$IsSliding())
                        apps.filter((app, index) => index !== jssor_slider.$CurrentIndex()).forEach(app => app.restart(true));
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
                    apps.forEach((app, i) => app.ready.then(app => app.restart(i !== 0)));
                }, (config.fadeinOnLoadDelay < 1 ? 1 : config.fadeinOnLoadDelay) * 750 );

                return jssor_slider;
            };
        </script>
        <script type="module">
            $.when(configPromise, $.ready).then(async config => {
                if (config.hideCursor)
                    document.body.style.cursor = 'none';
                if (config.disableScrolling)
                    document.body.style.overflow = 'hidden';

                const commonScriptsPromise = Promise.all(config.common.map(scriptUrl => $.getScript(scriptUrl)));

                commonScriptsPromise.then(() => config.apps.forEach(async (appPaths, sliderNum) => {
                    const slidesWrapper = document.getElementById(`slides${sliderNum}`);
                    content_slides[sliderNum] = [];

                    const loadApp = appPath => import(appPath).then(appModule => new appModule.default());
                    const apps = await Promise.all(appPaths.map(loadApp));
                    console.log(apps);
                    apps.forEach(app => slidesWrapper.appendChild(createSlide(app)));
                    console.log(sliderNum, content_sliders);
                    content_sliders[sliderNum] = jssor_app_slider_starter(`slider${sliderNum}_container`, apps, config);
                    console.log(sliderNum, content_sliders);
                }));
            });
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
    >
        <div
            id="wrapper"
            class="fade-in"
            animationend="wrapper.classList.remove( 'fade-in' ); wrapper.style.animation = 'none';"
            style="animation-delay: <?=$fadein_on_load_delay ?>s;"
        >

            <!-- background animation outsources into separate iframe to avoid interference with apps -->
            <iframe width="2160" height="3840" src="<?=$background_animation_url ?>" scrolling="no" style="position: absolute; top:0px; left:0px; border: none;"></iframe>

            <div class="bg-overlay"></div>

            <div class="page_header">
                Touch-Screen-Station: IMAGINARY, Dr. Christian Stussak (www.imaginary.org)<br>
                Programme: Cinderella, Prof. Dr. Dr. Jürgen Richter-Gebert (www.cinderella.de)
            </div>

        <div id="slider_top" class="top_slider">
            <!-- Slides Container -->
            <div u="slides" class="top_slider_slides">
                <div>Interaktive Mathematik<br /> Berühren Sie den Bildschirm!</div>
                <div>Hands-On Mathematik<br />Berühren Sie den Bildschirm!</div>
                <div>Mathematische Experimente<br />Berühren Sie den Bildschirm!</div>
                <div>Information und Hintergründe<br />www.mathematikon.de/imaginary</div>
            </div>
            <!-- Trigger -->
            <script>simple_fade_slider('slider_top');</script>
        </div>

            <template id="slide_template">
                <div>
                    <div class="app"></div>
                    <div class="app_description"></div>
                    <div class="app_name"></div>
                    <div class="app_credits"></div>
                </div>
            </template>

            <!-- BEGIN slider 0 -->
            <div id="slider0_container" class="content_slider0">
                <!-- Slides Container -->
                <div class="app_wrapper_bg">
                    <!-- ensure bg color between slides -->
                </div>

                <div u="slides" id="slides0" class="app_wrapper">
                    <!-- slides will be inserted here -->
                </div>

                <!--#region Bullet Navigator Skin Begin -->
                <!-- Help: http://www.jssor.com/development/slider-with-bullet-navigator-jquery.html -->
                <!-- bullet navigator container -->
                <div u="navigator" class="jssorb10">
                    <!-- bullet navigator item prototype -->
                    <div u="prototype"
                         ontouchend="var index = Array.prototype.indexOf.call(this.parentNode.children,this); content_sliders[0].fix_touchend_action( event, this, function() { content_sliders[0].$PlayTo( index ); }, false );"></div>
                </div>
                <!--#endregion Bullet Navigator Skin End -->

                <!--#region Arrow Navigator Skin Begin -->
                <!-- Help: http://www.jssor.com/development/slider-with-arrow-navigator-jquery.html -->
                <!-- Arrow Left -->
                <div ontouchend="content_sliders[0].fix_touchend_action( event, this, content_sliders[0].$Prev, true );">
                    <div id="slider0_arrowleft" u="arrowleft" class="jssor_arrow" style="left:0px;">
                        <svg width="200" height="700" class="svg_arrow" style="transform: rotate(180deg);">
                            <g transform="translate(45,0)">
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline_toucharea"/>
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <!-- Arrow Right -->
                <div ontouchend="content_sliders[0].fix_touchend_action( event, this, content_sliders[0].$Next, true );">
                    <div u="arrowright" class="jssor_arrow" style="right:0px;">
                        <svg width="200" height="700" class="svg_arrow">
                            <g transform="translate(45,0)">
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline_toucharea"/>
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <!--#endregion Arrow Navigator Skin End -->
            </div>
            <!-- END slider 0 -->


            <!-- BEGIN slider 1 -->
            <div id="slider1_container" class="content_slider1">
                <!-- Slides Container -->
                <div class="app_wrapper_bg">
                    <!-- ensure bg color between slides -->
                </div>

                <div u="slides" id="slides1" class="app_wrapper">
                    <!-- slides will be inserted here -->
                </div>

                <!--#region Bullet Navigator Skin Begin -->
                <!-- Help: http://www.jssor.com/development/slider-with-bullet-navigator-jquery.html -->
                <!-- bullet navigator container -->
                <div u="navigator" class="jssorb10">
                    <!-- bullet navigator item prototype -->
                    <div u="prototype"
                         ontouchend="var index = Array.prototype.indexOf.call(this.parentNode.children,this); content_sliders[1].fix_touchend_action( event, this, function() { content_sliders[1].$PlayTo( index ); }, false );"></div>
                </div>
                <!--#endregion Bullet Navigator Skin End -->

                <!--#region Arrow Navigator Skin Begin -->
                <!-- Help: http://www.jssor.com/development/slider-with-arrow-navigator-jquery.html -->
                <!-- Arrow Left -->
                <div ontouchend="content_sliders[1].fix_touchend_action( event, this, content_sliders[1].$Prev, true );">
                    <div id="slider1_arrowleft" u="arrowleft" class="jssor_arrow" style="left:0px;">
                        <svg width="200" height="700" class="svg_arrow" style="transform: rotate(180deg);">
                            <g transform="translate(45,0)">
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline_toucharea"/>
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <!-- Arrow Right -->
                <div ontouchend="content_sliders[1].fix_touchend_action( event, this, content_sliders[1].$Next, true );">
                    <div u="arrowright" class="jssor_arrow" style="right:0px;">
                        <svg width="200" height="700" class="svg_arrow">
                            <g transform="translate(45,0)">
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline_toucharea"/>
                                <polyline points="5,0 100,350 5,700" class="svg_arrow_polyline"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <!--#endregion Arrow Navigator Skin End -->
            </div>
            <!-- END slider 1 -->

            <div class="page_footer">
            </div>
        </div>
    </body>
</html>
