<div class="app">

        <script id='app_cinderella_10_csdraw' type='text/x-cindyscript'>
        fillcircle((0,0),100,color->(0,0,0));
            t1=map(A,B,B,C);
            t2=map(A,B,B,D);
            col(x):=(0.6*x,(1-x)*.8,0);


            tree(a,b,n):=(
                          if(n>0&|a_[1,2]/a_3,b_[1,2]/b_3|>.15,
                             draw(a,b,size->n*1*2,color->col(n/nn));
                             tree(t1*a,t1*b,n-1);
                             tree(t2*a,t2*b,n-1);
                             );
                          );
            nn=12;
           // drawimage((-15,-11),(15,-11),"back");

            tree(A.homog,B.homog,nn);


        </script>

        <script id='app_cinderella_10_csinit' type='text/x-cindyscript'>

        reset():=(

A.xy=(0,-8);
B.xy=(0,-4.5);
C.xy=(1.5,-2);
D.xy=(-1.6,-2.5);
    );
        </script>

        <script type="text/javascript">
    (function(){
        var uid = 'app_cinderella_10_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);
        document.write( "<canvas id=\"" + uid + "\" width=\"1560\" height=\"1170\"></canvas>" );

            var gslp=[

                      {name:"A", type:"Free",size:6, pos:[0,-8],color:[1,1,1]},
                      {name:"B", type:"Free",size:6, pos:[0,-4.5],color:[1,1,1]},
                      {name:"C", type:"Free",size:6, pos:[1.5,-2],color:[1,1,1]},
                      {name:"D", type:"Free",size:6, pos:[-1.6,-2.5],color:[1,1,1]},
                                           ];
            var cdy10=createCindy({canvasname:uid,
                        scripts:"app_cinderella_10_cs*",
            			transform: [{visibleRect: [-10, 10, 10, -10]}],
                        geometry:gslp});

current_content_slides.push(
             new function () {
                 return {
                     pause: function() {
                        console.log( 'pause tree' );
                     },
                     resume: function() {
                        console.log( 'resume tree' );
                     },
                     restart: function( pause_after_restart ) {
                        console.log( 'restart tree' );
                        cdy10.evokeCS('reset();');
                      }
                 }
             }
         );


    })();

        </script>
</div>
<div class="app_description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</div>
<div class="app_name">Ein Baum</div>
<div class="app_credits"></div>
