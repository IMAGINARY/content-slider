<div class="app">
    <iframe src="http://science-to-touch.com/Mathematikon/dmweb/content/G4/Widget.html?" style="width: 100%; height: 100%;" ></iframe><script>
        current_content_slides.push(
            new function () {
                var iframe = document.currentScript.previousSibling;
                return {
                    pause: function() { console.log( 'pause app1' ); },
                    resume: function() { console.log( 'resume app1' ); },
                    restart: function() { console.log( 'restart app1' ); iframe.src += 'a'; }
                }
            }
        );
    </script>
</div>
<div class="app_description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</div>
<div class="app_name">App1</div>
<div class="app_credits">Author 1a<br/>Author 1b</div>
