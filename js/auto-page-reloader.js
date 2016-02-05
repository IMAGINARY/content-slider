(function() {
    var reload_time_threshold = document.body.getAttribute( "reload-delay" ) * 1000;
    var idle_time_threshold = document.body.getAttribute( "idle-delay" ) * 1000;
    var reload_button_size = document.body.getAttribute( "reload-button-size" );

    var wrapper = document.getElementById( "wrapper" );

    var tl = document.createElement( "div" );
    tl.className = "reload_button bl";
    tl.style.width = reload_button_size;
    tl.style.height = reload_button_size;
    tl.addEventListener('click', fade_out_and_reload );
    tl.addEventListener('touchend', fade_out_and_reload );
    wrapper.appendChild( tl );

    var tr = document.createElement( "div" );
    tr.className = "reload_button br";
    tr.style.width = reload_button_size;
    tr.style.height = reload_button_size;
    tr.addEventListener('click', fade_out_and_reload );
    tr.addEventListener('touchend', fade_out_and_reload );
    wrapper.appendChild( tr );

    function fade_out_and_reload()
    {
        wrapper.style = "";
        wrapper.className = "fade-out";
        setTimeout( function() { location.reload(); }, 1500 );
    }

    var idle_timer = null;
    function non_idle_handler()
    {
        console.log( "non_idle_handler for reload" );
        if( idle_timer != null )
            clearTimeout( idle_timer );
        idle_timer = setTimeout( fade_out_and_reload, idle_time_threshold );
    }

    setTimeout( function() {
            console.log( "reloading page after " + Math.floor(idle_time_threshold / 1000.0) + "s in idle mode" );

            non_idle_handler();

            document.addEventListener('mouseup', non_idle_handler, true);
            document.addEventListener('mousemove', non_idle_handler, true);
            document.addEventListener('mousedown', non_idle_handler, true);
            document.addEventListener("touchstart", non_idle_handler, true);
            document.addEventListener("touchend", non_idle_handler, true);
            document.addEventListener("touchcancel", non_idle_handler, true);
            document.addEventListener("touchmove", non_idle_handler, true);
        },
        reload_time_threshold
    );

    setTimeout( function() {
        document.getElementById( 'wrapper' ).className =
            document.getElementById( 'wrapper' ).className.replace
                ( /(?:^|\s)fade-in(?!\S)/g , '' );
    }, ( document.body.getAttribute( "fadein-on-load-delay" ) + 2 ) * 1000 );

})();
