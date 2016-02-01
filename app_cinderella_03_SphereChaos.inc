<div class="app">
<script id="app_cinderella_03_csdraw" type="text/x-cindyscript">
restrict(p,mi,ma):=(
  xx=max(min(p.x,ma.x),mi.x);
  yy=max(min(p.y,ma.y),mi.y);
  p.xy=(xx,yy);
);
minpt=(-16,-12);
maxpt=(26,19);
//draw(minpt,maxpt);
//draw(minpt);
//draw(maxpt);
restrict(D,minpt,maxpt);
restrict(A,minpt,maxpt);
restrict(B,minpt,maxpt);
restrict(C,minpt,maxpt);


E.xy=(E-D)/|E-D|*3+D;
if(mover()==D,E.xy=D+diff);
diff=E-D;
m1=A.xy;
r1=C0.radius;
m2=B.xy;
r2=C1.radius;
m3=C.xy;
r3=C2.radius;

fillcircle(m1,r1,color->(.25,0,0));
fillcircle(m2,r2,color->(.25,0,0));
fillcircle(m3,r3,color->(.25,0,0));

o1=["circ",m1,r1];
o2=["circ",m2,r2];
o3=["circ",m3,r3];

p=D.xy;
s=E-D;
s=s/|s|;




intersect(p,s,o):=(
ll=[];
if(o_1=="circ", (
m=o_2;
r=o_3;
q=p-m;
scal=s*q;
dist=q*q-r^2;

a=-scal+sqrt(scal^2-dist);
b=-scal-sqrt(scal^2-dist);

if(|im(a)|<0.00000001 & re(a)>0.00000001,ll=ll++[[o,re(a)]]);
if(|im(b)|<0.00000001 & re(b)>0.00000001,ll=ll++[[o,re(b)]]);
);
ll;
)
);

reflect(p,s,o,a):=(
pp=p+a*s;
ss=s;
if(o_1=="circ", (
   sp=pp-o_2;
   sp=sp/|sp|;
   ss=s-2*(s*sp)*sp;
);
);
[pp,ss];
);

stop=false;
count=0;
n=500;
alpha=1;
dim=0.99;
while(count<n & !stop,
count=count+1;
l=intersect(p,s,o1)++intersect(p,s,o2)++intersect(p,s,o3);

l=sort(l,#_2);

if(length(l)>0,(
 hit=l_1;
 erg=reflect(p,s,hit_1,hit_2);
//   draw(erg_1);
 draw(p,erg_1,color->(1,1,1),alpha->alpha,size->2);
//  draw(erg_1,erg_1+erg_2*.1,color->(1,0,0),size->2);
 p=re(erg_1);
 s=re(erg_2);
),(
 draw(p,p+100*s,color->(1,1,1),alpha->alpha,size->2);
 stop=true;
)
);
alpha=alpha*dim;
);

</script>
<script id="app_cinderella_03_csmousedown" type="text/x-cindyscript">
</script>


<script id="app_cinderella_03_csinit" type="text/x-cindyscript">
reset():=(

A.homog=(1.485714, -4, 1.408163);
B.homog=(-1.2, 9, 1);
C.homog=(12.043333, 6.035, 1);
D.homog=(4, -1.5, 0.2192982);
E.homog=(13, -3, 1);
    );
</script>



<script type="text/javascript">
    (function(){
        var uid = 'app_cinderella_03_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);
        document.write( "<canvas id=\"" + uid + "\" width=\"1560\" height=\"1170\"></canvas>" );

            var cdy03 = createCindy({
            scripts: "app_cinderella_03_cs*",
            defaultAppearance: {},
            ports: [{
            id: uid,
            background: "#000000",

            transform: [{visibleRect: [-16.291666666666668, 19.5, 26.375, -12.5]}]
            }],
            geometry: [
            {name: "A", type: "Free", pos: [1.4857142857142855, -4, 1.4081632653061225], color: [1, 0, 0], alpha: 0.8999999761581421, pointborder: false,size:9},
            {name: "C0", type: "CircleMr", args: ["A"], radius: 5, size: 3, color: [1, 1, 0], alpha: 0.8999999761581421},
            {name: "B", type: "Free", pos: [-1.2, 9, 1], color: [1, 0, 0], alpha: 0.8999999761581421, pointborder: false,size:9},
            {name: "C1", type: "CircleMr", args: ["B"], radius: 5, size: 3, color: [1, 1, 0], alpha: 0.8999999761581421},
            {name: "C", type: "Free", pos: [12.043333333333337, 6.035, 1], color: [1, 0, 0], alpha: 0.8999999761581421, pointborder: false,size:9},
            {name: "C2", type: "CircleMr", args: ["C"], radius: 7, size: 3, color: [1, 1, 0], alpha: 0.8999999761581421},
            {name: "D", type: "Free", pos: [4, -1.5, 0.2192982456140351], size: 6, color: [1, 0.7, 0], alpha: 0.8999999761581421, pointborder: false,size:9},
            {name: "C3", type: "CircleMr", args: ["D"], radius: 1, size: 3, color: [0, 0, 1], alpha: 0},
            {name: "E", type: "Free", pos: [13, -3, 1], pinned: false, size: 4, color: [1, 1, 1]}
            ]
            });
current_content_slides.push(
             new function () {
                 return {
                     pause: function() { 
                        console.log( 'pause spheres' ); 
                     },
                     resume: function() { 
                        console.log( 'resume spheres' );
                     },
                     restart: function( pause_after_restart ) { 
                        console.log( 'restart spheres' );
                        cdy03.evokeCS('reset();');
                      }
                 }
             }
         );

        })();
</script>
</div>
<div class="app_description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</div>
<div class="app_name">Lichtstrahl</div>
<div class="app_credits"></div>
