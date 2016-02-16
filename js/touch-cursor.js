(function() {
    var parent_elem = document.body;
    var touch_cursors = [];
    var touch_cursor_html = document.body.getAttribute( "touch-cursor-html" );

    function setup_touch_debugging()
    {
        for( i = 0; i < 40; i++ )
        {
            var dot = document.createElement( "div" );
            dot.className = 'debug_cursor';
            dot.innerHTML = touch_cursor_html;
            dot.style.display = 'none';

            parent_elem.appendChild( dot );
            parent_elem.addEventListener( 'touchstart', debug_touchstart_event, true );
            parent_elem.addEventListener( 'touchmove', debug_touchmove_event, true );
            parent_elem.addEventListener( 'touchend', debug_touchend_event, true );

            touch_cursors[ i ] = dot;
        }
    }

    function move_dot( dot, x, y )
    {
        dot.style.display = 'inline';
        dot.style.top = y + "px";
        dot.style.left = x + "px";
    }

    function debug_touchstart_event( event ) {
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchstart_event_single( event.changedTouches.item( i ) );
    }

    function debug_touchmove_event( event ) {
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchmove_event_single( event.changedTouches.item( i ) );
    }

    function debug_touchend_event( event ) {
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchend_event_single( event.changedTouches.item( i ) );
    }

    function debug_touchstart_event_single( touch ) {
        move_dot( touch_cursors[ touch.identifier ], touch.pageX, touch.pageY );
    }

    function debug_touchmove_event_single( touch ) {
        move_dot( touch_cursors[ touch.identifier ], touch.pageX, touch.pageY );
    }

    function debug_touchend_event_single( touch ) {
        touch_cursors[ touch.identifier ].style.display = 'none';
    }

    setup_touch_debugging();
})();
