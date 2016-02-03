<!-- your part begins here -->
<div class="app">
    <script>
        // anonymous function to avoid polluting the global namespace with
        // symbols (also allows to runs the same app several times on the same
        // page without modification).
        (function() {
            // BEGIN your app related variables and methods
            var div = document.createElement("div");
            div.style.fontSize = '64px';
            div.style.color = '#'+Math.floor(Math.random()*16777215).toString(16);
            document.currentScript.parentNode.appendChild( div );

            var number = 0;
            var timeout;
            function animate() {
                render();
                number++;
                timeout = window.setTimeout( animate, 1000 );
            }
            function render() {
                div.innerHTML = number;
            }
            timeout = window.setTimeout( animate, 1000 );
            // END your app related variables and methods

            // an object with pause, resume and restart methods has to be pushed
            // into the current_content_slides array by each app
            // (the implementation has to be app specific).
            current_content_slides.push(
                new function () {
                    return {
                        pause: function() {
                            console.log( 'pause app' );
                            if( timeout !== null )
                            {
                                window.clearTimeout( timeout );
                                timeout = null;
                            }
                        },
                        resume: function() {
                            console.log( 'resume app' );
                            if( timeout === null )
                                timeout = window.setTimeout( animate, 1000 );
                        },
                        restart: function( pause_after_restart ) {
                            console.log( 'restart app' );
                            number = 0;
                            render();
                            if( !pause_after_restart && timeout === null )
                                timeout = window.setTimeout( animate, 1000 );
                        }
                    }
                }
            );
        })();
    </script>
</div>
<div class="app_description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</div>
<div class="app_name">App name</div>
<div class="app_credits">Author 1<br/>Author 2</div>
<!-- your part ends here -->
