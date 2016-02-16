<div class="app">

<script id="csmouseup" type="text/x-cindyscript">
up=up+1;
l=l++[["UP:",mouse().xy]];
sta=sta++[mouse().xy];
st=st++[sta];
sta=[];

if(|mouse().xy,A|<5,l=[];st=[]);
;
</script>
<script id="csdraw" type="text/x-cindyscript">
drawcircle((0,0),1);
drawcircle((3,0),1);
drawcircle((6,0),1);
draw((0,0)+gauss(exp(i*pi/8*down)));
draw((3,0)+gauss(exp(i*pi/8*up)));
draw((6,0)+gauss(exp(i*pi/8*drag)));
apply(1..length(l),drawtext((10,13-#*.7),l_#));
apply(st,connect(#);
draw(#_1);
draw(#_(-1),color->(1,0,0));
);
connect(sta,color->red(1));
;
</script>
<script id="csmousedown" type="text/x-cindyscript">
down=down+1;
l=l++[["DOWN:",mouse().xy]];
if(|mouse().xy,A|<5,l=[];st=[]);
sta=[mouse().xy];
;
</script>
<script id="csmousedrag" type="text/x-cindyscript">
drag=drag+1;
if(l!=[],
  if(l_(-1)_1=="DRAG:",
    l_(-1)_2=l_(-1)_2+1,
    l=l++[["DRAG:",1]]
  )
);

sta=sta++[mouse().xy];



if(|mouse().xy,A|<5,l=[];st=[]);
;
</script>
<script id="csinit" type="text/x-cindyscript">
up=0;
drag=0;
down=0;
l=[];
st=[];
</script>

    <script type="text/javascript">
    (function(){

    var uid = 'app_cinderella_10_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);
        document.write( "<canvas id=\"" + uid + "\" width=\"1560\" height=\"1170\"></canvas>" );

var cdy00=createCindy({ 
	scripts: "cs*", 
	defaultAppearance: { fontFamily: "sans-serif", lineSize: 1, pointSize: 5.0 }, 
	angleUnit: "°", 
	geometry: [ 
		{ name: "A", type: "Free", pos: [ 4.0, -3.9365079365079367, -0.5291005291005291 ], color: [ 1.0, 0.0, 0.0 ], pinned: true, labeled: true } ], 
	ports: [ 
		{                             id: uid,
                            background: "rgba(255,255,255,1)", width: 1560, height: 1170, transform: [ { visibleRect: [ -12.38, 11.5, 20.02, -8.82 ] } ] } ], 
	cinderella: { build: 1812, version: [ 2, 9, 1812 ] } });

current_content_slides.push(
             new function () {
                 return {
                     pause: function() { 

                     },
                     resume: function() { 

                     },
                     restart: function( pause_after_restart ) { 
                      }
                 }
             }
         );
    })();

    </script>
</div>
<div class="app_description"></div>
<div class="app_name">EVENT TESTER</div>
<div class="app_credits"></div>
