(function() {
    function stopEventPropagation( evt ) { evt.stopImmediatePropagation(); }

    document.body.addEventListener( 'mousedown', stopEventPropagation, true );
    document.body.addEventListener( 'mousemove', stopEventPropagation, true );
    document.body.addEventListener( 'mouseup', stopEventPropagation, true );

    // maybe not needed, but added to be on the safe side
    document.body.addEventListener( 'click', stopEventPropagation, true );
    document.body.addEventListener( 'dblclick', stopEventPropagation, true );
})();
