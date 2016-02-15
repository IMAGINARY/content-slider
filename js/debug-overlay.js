(function() {
    var parent_elem = document.body;
    var mouse_dot;
    var touch_dots = [];
    var event_id = 0;
    var debug_console;
    var mouse_color = 'white';
    var touch_colors = [ 'Gold', 'DodgerBlue', 'Crimson', 'LimeGreen', 'OrangeRed', 'DeepPink' ];
    var debug_cursor_scale = document.body.getAttribute( "debug-cursor-scale" );

    function create_dot( type, id, color )
    {
        var dot_prototype = document.createElement( "div" );
        dot_prototype.className = 'debug_cursor';
        dot_prototype.style.transform = 'scale( ' + debug_cursor_scale + ' )';

        dot_prototype.innerHTML = '<svg style="transform: translate(-25%, -50%);"><circle cx="75" cy="75" r="40" stroke="black" stroke-width="3" fill="' + color + '" fill-opacity="0.5"/><line x1="0" y1="75" x2="150" y2="75" stroke="black" stroke-width="3" /><line x1="75" y1="0" x2="75" y2="150" stroke="black" stroke-width="3" /><line x1="0" y1="75" x2="150" y2="75" stroke="white" stroke-width="1" /><line x1="75" y1="0" x2="75" y2="150" stroke="white" stroke-width="1"/><text x="0" y="30" fill="black" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + type + '</text><text x="150" y="30" fill="black" text-anchor="end" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + id + '</text><text x="150" y="140" fill="black" text-anchor="end" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + type + '</text><text x="0" y="140" fill="black" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + id + '</text></svg>';

        return dot_prototype;
    }

    function create_debug_console() {
        debug_console = document.createElement( "div" );
        debug_console.className = 'debug_console';
        parent_elem.appendChild( debug_console );
    }

    function debug_console_log( text, color, object )
    {
        var item = document.createElement( 'span' );
        item.style.color = color;
        item.innerHTML = text;
        debug_console.insertBefore( document.createElement( 'br' ), debug_console.firstChild );
        debug_console.insertBefore( item, debug_console.firstChild );
        while( debug_console.childNodes.length > 500 )
            debug_console.removeChild( debug_console.lastChild );
        console.log( object );
    }

    function setup_mouse_debugging()
    {
        var dot = create_dot( "M", "0", mouse_color );
        //dot.style.display = "none";
        dot.style.opacity = 0.25;
        parent_elem.appendChild( dot );
        parent_elem.addEventListener( 'mousedown', debug_mousedown_event, true );
        parent_elem.addEventListener( 'mousemove', debug_mousemove_event, true );
        parent_elem.addEventListener( 'mouseup', debug_mouseup_event, true );
        mouse_dot = dot;
    }

    function setup_touch_debugging()
    {
        for( i = 0; i < 40; i++ )
        {
            var dot = create_dot( "T", '' + i, touch_colors[ i % touch_colors.length ] );
            dot.style.display = 'none';

            parent_elem.appendChild( dot );
            parent_elem.addEventListener( 'touchstart', debug_touchstart_event, true );
            parent_elem.addEventListener( 'touchmove', debug_touchmove_event, true );
            parent_elem.addEventListener( 'touchend', debug_touchend_event, true );

            touch_dots[ i ] = dot;
        }
    }

    function move_dot( dot, x, y )
    {
        dot.style.top = y + "px";
        dot.style.left = x + "px";
    }


    function debug_mousedown_event( event ) {
        event_id++;
        debug_console_log( '#' + event_id + ': mousedown', mouse_color, event );
        var dot = mouse_dot;
        dot.style.opacity = 1.0;
        move_dot( dot, event.pageX, event.pageY );
        return false;
    }

    function debug_mousemove_event( event ) {
        event_id++;
        debug_console_log( '#' + event_id + ': mousemove', mouse_color, event );
        var dot = mouse_dot;
        move_dot( dot, event.pageX, event.pageY );
        return false;
    }

    function debug_mouseup_event( event ) {
        event_id++;
        debug_console_log( '#' + event_id + ': mouseup', mouse_color, event );
        var dot = mouse_dot;
        dot.style.opacity = 0.25;
        move_dot( dot, event.pageX, event.pageY );
        return false;
    }


    function debug_touchstart_event( event ) {
        event_id++;
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchstart_event_single( event, i );
    }

    function debug_touchmove_event( event ) {
        event_id++;
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchmove_event_single( event, i );
    }

    function debug_touchend_event( event ) {
        event_id++;
        for( i = 0; i < event.changedTouches.length; i++ )
            debug_touchend_event_single( event, i );
    }

    function debug_touchstart_event_single( event, touch_index ) {
        var touch = event.changedTouches.item( touch_index );
        debug_console_log( '#' + event_id + ': touchstart ' + touch.identifier, touch_colors[ touch.identifier % touch_colors.length ], event );
        var dot = touch_dots[ touch.identifier ];
        dot.style.display = 'inline';
        dot.style.opacity = 1.0;
        move_dot( dot, touch.pageX, touch.pageY );
    }

    function debug_touchmove_event_single( event, touch_index ) {
        var touch = event.changedTouches.item( touch_index );
        debug_console_log( '#' + event_id + ': touchmove ' + touch.identifier, touch_colors[ touch.identifier % touch_colors.length ], event );
        var dot = touch_dots[ touch.identifier ];
        dot.style.display = 'inline';
        move_dot( dot, touch.pageX, touch.pageY );
    }

    function debug_touchend_event_single( event, touch_index ) {
        var touch = event.changedTouches.item( touch_index );
        debug_console_log( '#' + event_id + ': touchend ' + touch.identifier, touch_colors[ touch.identifier % touch_colors.length ], event );
        var dot = touch_dots[ touch.identifier ];
        dot.style.display = 'inline';
        dot.style.opacity = 0.25;
        move_dot( dot, touch.pageX, touch.pageY );
    }

    create_debug_console();
    setup_mouse_debugging();
    setup_touch_debugging();
})();
