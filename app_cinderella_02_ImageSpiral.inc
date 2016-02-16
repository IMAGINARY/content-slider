<div class="app">
    <script id="app_cinderella_02_csmouseup" type="text/x-cindyscript">

</script>
<script id="app_cinderella_02_cstick" type="text/x-cindyscript">

   
      E.xy=gauss(complex(E-D)*exp(.03*i))+D;
      B.xy=gauss(complex(B)*exp(.003*i));
      C.xy=gauss(complex(C)*exp(.001*i));


</script>



<script id="app_cinderella_02_csdraw" type="text/x-cindyscript">


if(pinall,apply(1..length(allpoints()), (allpoints()_#).xy=bck_# ));

restrict(p,mi,ma):=(
  xx=max(min(p.x,ma.x),mi.x);
  yy=max(min(p.y,ma.y),mi.y);
  p.xy=(xx,yy);
);
minpt=(-11,-14);
maxpt=(18,16);
//draw(minpt,maxpt);
//draw(minpt);
//draw(maxpt);
restrict(C,minpt,maxpt);
restrict(B,minpt,maxpt);


E.xy=(E-D)/|E-D|*3+D;

if(G.y<=F.y,G.xy=F.xy);
if(G.y>=A.y,G.xy=A.xy);

bb=complex(B);
cc=complex(C);
sc=|F,G|/|G,A+(0,1)|;

w=arctan2(E-D)-90°;
fac=cc/bb;
st=1;
erg=apply(1..1000,
e=st;
st=st*fac;
e;
);
erg=reverse(erg);


apply(erg,st,
if(|st|*sc<10,

drawimage(gauss(bb*st),images_sel_2,scale->|st|*sc/2.5,angle->arctan2(im(st*i),re(st*i))-w);
);
);



apply(1..6,ind=images_#;drawimage(ind_1,ind_2,scale->ind_3,alpha->if(sel==#,1,0.4)));



drawimage(D.xy,
images_sel_2,
scale->images_sel_3*.7,
angle->-w);



bck=apply(allpoints(),#.xy);

;
</script>
<script id="app_cinderella_02_csmousedown" type="text/x-cindyscript">
pauseanimation();
pendanimation=false;
pinall=false;

got=sort(1..length(images),p=images_#_1;|p,mouse().xy|)_1;
if(|images_got_1,mouse().xy|<5,sel=got;pinall=true;);

</script>


<script id="app_cinderella_02_csinit" type="text/x-cindyscript">
sel=1;
ss=1.6;
pendanimation=true;
images=[
[(21,1),"test1",.9/ss],
[(26,1),"test2",.7/ss],
[(21,-4.5),"test3",.8/ss],
[(26,-4.5),"test4",.7/ss],
[(21,-10),"test5",.7/ss],
[(26,-10),"test6",.5/ss]];

pause():=(
   stopanimation();
);

resume():=(
   if(pendanimation,playanimation());
);

reset():=(
B.homog=(4, -0.3346613, 0.39840637);
C.homog=(4, 1.22893871, 0.43593195);
D.homog=(4, 1.9, 0.179533);
E.homog=(5, 3.1, 0.2085930);
G.homog=(4, 1.8, 0.1488095);
sel=1;
pendanimation=true;

    );
playanimation();
</script>

<script type="text/javascript">
    (function(){
        var uid = 'app_cinderella_02_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);
        document.write( "<canvas id=\"" + uid + "\" width=\"1560\" height=\"1170\"></canvas>" );

        var cdy02 = createCindy({
            scripts: "app_cinderella_02_cs*",
            defaultAppearance: {},
            images: {
            test1: "app_cinderella_02/test1.png",
            test2: "app_cinderella_02/test2.png",
            test3: "app_cinderella_02/test3.png",
            test4: "app_cinderella_02/test4.png",
            test5: "app_cinderella_02/test5.png",
            test6: "app_cinderella_02/test6.png"
            },
            ports: [{
            id: uid,
            background: "rgba(0,0,0,0)",
            transform: [{visibleRect: [-12, 16, 30, -14]}]
            }],
            geometry: [
            {name: "B", type: "Free", pos: [4, -0.3346613545816733, 0.39840637450199207], size: 9, color: [0, 1, 0]},
            {name: "C", type: "Free", pos: [4, 1.2289387168822175, 0.4359319522866157], size: 9, color: [0, 1, 0]},
            {name: "D", type: "Free", pos: [4, 1.9, 0.17953321364452424], pinned: true, size: 7, color: [1, 1, 1], labeled: true, visible: false},
            {name: "C0", type: "CircleMr", args: ["D"], radius: 3, pinned: true, size: 3, color: [1, 1, 1], printname: "$C_{0}$"},
            {name: "E", type: "Free", pos: [5, 3.1, 0.20859302441322417], pinned: false, size: 9, color: [1, 1, 1]},
            {name: "A", type: "Free", pos: [4, 2, 0.14880952380952378], pinned: true, color: [1, 0, 0], labeled: true, visible: false},
            {name: "F", type: "Free", pos: [4, 1.1, 0.14880952380952378], pinned: true, color: [1, 0, 0], labeled: true, visible: false},
            {name: "a", type: "Segment", args: ["A", "F"], pos: [-0.1488095238095238, 0, 4], size: 3, color: [1, 1, 1], labeled: true},
            {name: "G", type: "PointOnLine", args: ["a"], pos: [4, 1.8, 0.1488095238095238], size: 9, color: [1, 1, 1], labeled: true}
            ]
        });
current_content_slides.push(
             new function () {
                 return {
                     pause: function() { 
                        console.log( 'pause spheres' ); 
                        cdy02.evokeCS('pause();');
                     },
                     resume: function() { 
                        console.log( 'resume spheres' );
                        cdy02.evokeCS('resume();');

                     },
                     restart: function( pause_after_restart ) { 
                        console.log( 'restart spheres' );
                        cdy02.evokeCS('reset();');
                      }
                 }
             }
         );

    })();
</script>
</div>
<div class="app_description">Ein Bild wird um ein Zentrum gedreht und gestaucht oder gestreckt, das nennt man eine <em>Drehstreckung</em>. Das so veränderte Bild wird wieder gedreht und um denselben Faktor gestaucht oder gestreckt und so weiter. Dadurch entstehen wie von selbst faszinierende Bilder.</div>
<div class="app_name">Spirale</div>
<div class="app_credits"></div>
