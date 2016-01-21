<div class="app">
    <script>
        (function() {
             var canvas = document.createElement("canvas");
             document.currentScript.parentNode.appendChild( canvas );

             var c = canvas.getContext('2d');

             canvas.width = innerWidth;
             canvas.height = innerHeight;

            function clear() {
                c.clearRect(0, 0, canvas.width, canvas.height);
            }

             var paintColors = {};
             var mouseId = 'mouse';

             var mouseDown = false;

             function addMouseListeners(){
               canvas.addEventListener('mousemove', function(e){
                 if(mouseDown){
                   c.fillStyle = paintColors[mouseId];
                   drawCircle(e.clientX, e.clientY);
                 }
               });

               canvas.addEventListener('mousedown', function(e){
                 mouseDown = true;
                 setRandomPaintColor(mouseId);
               });

               canvas.addEventListener('mouseup', function(e){
                 mouseDown = false;
               });

               canvas.addEventListener('dblclick', function(e){
                 c.fillStyle = 'black';
                 c.fillRect(0,0,canvas.width, canvas.height);
               });
             }

             function setRandomPaintColor(id){
               function rand255(){ return Math.floor(Math.random()*255);}
               paintColors[id] = 'rgb('+rand255()+','+rand255()+','+rand255()+')';
             }

             function drawCircle(x, y){
               c.beginPath();
               c.arc(x-canvas.getBoundingClientRect().left, y-canvas.getBoundingClientRect().left, 20, 0, 2 * Math.PI);
               c.fill();
             }

             function addMultiTouchListeners(){
               canvas.addEventListener('touchmove',function(e){
                 var i, touch;
                 setRandomPaintColor();
                 for(i = 0; i < e.targetTouches.length; i++){
                   touch = e.targetTouches[i];
                   c.fillStyle = paintColors[touch.identifier];
                   drawCircle(touch.pageX, touch.pageY);
                 }
               });

               canvas.addEventListener('touchstart',function(e){
                 var i, touch;
                 for(i = 0; i < e.changedTouches.length; i++){
                   touch = e.changedTouches[i];
                   setRandomPaintColor(touch.identifier);
                 }
               });

               canvas.addEventListener('touchend',function(e){
                 var i, touch;
                 for(i = 0; i < e.changedTouches.length; i++){
                   touch = e.changedTouches[i];
                   console.log("removing "+touch.identifier);
                   delete paintColors[touch.identifier];
                 }
               });
             }

            /*
             // prevent scrolling
             document.body.addEventListener('touchmove', function(event) {
               event.preventDefault();
             }, false);
            */

             addMouseListeners();
             addMultiTouchListeners();

             current_content_slides.push(
                 new function () {
                     return {
                         pause: function() { console.log( 'pause app3' ); },
                         resume: function() { console.log( 'resume app3' ); },
                         restart: function() { console.log( 'restart app3' ); clear(); }
                     }
                 }
             );
        })();
    </script>
</div>
<div class="app_description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</div>
<div class="app_name">App2</div>
<div class="app_credits">Author 2a<br/>Author 2b</div>
