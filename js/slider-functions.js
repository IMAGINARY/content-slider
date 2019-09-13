function refreshAt(hours, minutes, seconds) {
    const now = new Date();
    const then = new Date();

    if (now.getHours() > hours ||
        (now.getHours() === hours && now.getMinutes() > minutes) ||
        now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    const timeout = (then.getTime() - now.getTime());
    setTimeout(() => window.location.reload(true), timeout);
}

// TODO: Do not hard-code the refresh time
refreshAt(0, 0, 0);

function simple_fade_slider(containerID) {

    const slides = document.getElementById(containerID).children[0].children;
    let currSlide = 0;

    function rotateSlide() {
        slides[currSlide].classList.remove('active');
        currSlide++;
        if (currSlide >= slides.length) {
            currSlide = 0;
        }
        slides[currSlide].classList.add('active');
    }

    setInterval(function () {
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

function jssor_app_slider_starter(containerId, apps, config) {
    const options = {
        $AutoPlay: false,
        $PauseOnHover: 0,
        $Idle: config['autoSlideDelay'] * 1000,
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

    const container = document.getElementById(containerId);

    container.addEventListener('mouseup', non_idle_handler, true);
    container.addEventListener('mousemove', non_idle_handler, true);
    container.addEventListener('mousedown', non_idle_handler, true);
    container.addEventListener("touchstart", non_idle_handler, true);
    container.addEventListener("touchend", non_idle_handler, true);
    container.addEventListener("touchcancel", non_idle_handler, true);
    container.addEventListener("touchmove", non_idle_handler, true);

    // implemented idle timeout myself since JSSOR idle mode does not
    // reset the timeout on interruption
    let idle_timer = null;

    function init_idle_timer() {
        if (idle_timer != null)
            clearTimeout(idle_timer);
        idle_timer = setTimeout(idle_handler, options.$Idle);
    }

    function non_idle_handler() {
        console.log("non_idle_handler");
        init_idle_timer();
    }

    function idle_handler() {
        console.log("idle_handler");
        jssor_slider.$Next();
        init_idle_timer();
    }

    init_idle_timer();

    const jssor_slider = new $JssorSlider$(containerId, options);
    let slide_restart_timer = null;
    jssor_slider.$On($JssorSlider$.$EVT_PARK, function (slideIndex) {
        for (let i = 0; i < apps.length; i++) {
            if (i === slideIndex)
                apps[i].ready.finally(() => apps[i].resume());
            else
                apps[i].ready.finally(() => apps[i].pause());
            if (slide_restart_timer !== null)
                window.clearTimeout(slide_restart_timer);
            slide_restart_timer = window.setTimeout(slide_restart_handler, config['appRestartDelay'] * 1000);
        }
    });

    function slide_restart_handler() {
        if (!jssor_slider.$IsSliding())
            apps.filter((app, index) => index !== jssor_slider.$CurrentIndex()).forEach(app => app.restart(true));
    }

    // only fire if touch ended on a node that is equal to or is a child node of element
    jssor_slider.fix_touchend_action = function (event, element, action, preventDefault) {
        const changedTouch = event.changedTouches[0];
        let elementBelow = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

        while (elementBelow != null && elementBelow !== element)
            elementBelow = elementBelow.parentElement;

        if (elementBelow === element) {
            action();
            if (preventDefault)
                event.preventDefault();
        }
    };

    apps.forEach((app, i) => app.ready.finally(() => i == jssor_slider.$CurrentIndex() ? app.resume() : app.pause()));

    // enable or disable bullet navigation
    if (config.disableBulletNavigation) {
        const bulletContainer = container.getElementsByClassName('jssorb10')[0];
        bulletContainer.classList.add('disable_pointer_events');
    }

    return jssor_slider;
}

export {refreshAt, simple_fade_slider, createSlide, jssor_app_slider_starter};
