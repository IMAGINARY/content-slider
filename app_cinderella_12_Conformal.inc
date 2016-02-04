<div class="app">



<script id='shader-fs-declareX' type='x-shader/x-fragment'>
precision highp float;

uniform float time;
uniform float speed;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 translate;
uniform float scale;
uniform sampler2D u_image;
varying vec2 v_texCoord;

</script>




<script id='shader-fs-preX' type='x-shader/x-fragment'>


vec2 position;

float pi;

vec4 point(vec2 a, vec3 col) {
   float l=length(a-position)*13.0;
   float al=clamp(5.0-l,0.0,1.0);
   float p2=clamp(4.0-l,0.0,1.0);
   return vec4(col*p2,al);
}

vec4 line(vec2 a,vec2 b,vec3 col) {
   vec2 nn=normalize(a-b);
   nn=vec2(-nn.y,nn.x);
   float dd=dot(nn,a)-dot(nn,position);
   dd=dd*dd*90.0;
   dd=.6-dd;
   float al=clamp(dd,0.0,1.0);
   return vec4(col,al);
}

vec4 compose(vec4 aa, vec4 bb) {
   return vec4(bb.rgb*bb.a+aa.rgb*(1.0-bb.a),1.0);
  // return b;
}

vec3 rgb_to_hsv(vec3 RGB)
{
  float r = RGB.x;
  float g = RGB.y;
  float b = RGB.z;

  float minChannel = min(r, min(g, b));
  float maxChannel = max(r, max(g, b));

  float h = 0.0;
  float s = 0.0;
  float v = maxChannel;

  float delta = maxChannel - minChannel;

  if (delta != 0.0) { 
    s = delta / v;

    if (r == v) h = (g - b) / delta;
    else if (g == v) h = 2.0 + (b - r) / delta;
    else /* b == v */ h = 4.0 + (r - g) / delta;
  }

  return vec3(h, s, v);
}

vec3 hsv_to_rgb(vec3 HSV)
{
  vec3 RGB; /* = HSV.z; */

  float h = HSV.x;
    h=(h-floor(h))*6.0;
  float s = HSV.y;
  float v = HSV.z;

  float i = floor(h);
  float f = h - i;

  float p = (1.0 - s);
  float q = (1.0 - s * f);
  float t = (1.0 - s * (1.0 - f));

  if (i == 0.0) { RGB = vec3(1.0, t, p); }
  else if (i == 1.0) { RGB = vec3(q, 1.0, p); }
  else if (i == 2.0) { RGB = vec3(p, 1.0, t); }
  else if (i == 3.0) { RGB = vec3(p, q, 1.0); }
  else if (i == 4.0) { RGB = vec3(t, p, 1.0); }
  else /* i == -1 */ { RGB = vec3(1.0, p, q); }

  RGB *= v;
    

  return RGB;
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 colorPolar(vec2 z){
    float n=nn.x;
    float dx=z.x;
    float dy=z.y;
    
    float dist =log(sqrt((dx*dx+dy*dy)))/pi*n+time*0.1;
    
    float grey =dist-floor(dist);
    
    float w=atan(dy,dx)/pi+time*0.1;
    w=w*.5;
    w=w-floor(w);
    
    float grey1=w*n*2.0-floor(w*n*2.0);
    
    float hue=w;
    hue=(hue-floor(hue));
    return hsv_to_rgb(vec3(hue,1.0,sqrt(grey1*grey)*.5+.5));
}

vec3 colorImg1(vec2 z){
    float n=nn.x*.5;
    float dx=z.x;
    float dy=z.y;
    
    float dist =log(sqrt((dx*dx+dy*dy)))/pi*n;
    
    float xx =dist-floor(dist);
    
    float w=atan(dy,dx)/pi+time;
    w=w*.5;
    w=w-floor(w);
    
    float yy=w*n*2.0-floor(w*n*2.0);
    vec3 precol= texture2D(u_image, mod(vec2(xx,yy),1.0)).rgb;
    vec3 precol1=  rgb2hsv(precol);
    precol1.y*=sat.x;
    precol1.x=precol1.x+hue.x;
    precol=  hsv2rgb(precol1);
    return precol;

   }

vec3 colorImg(vec2 z){

    float de=0.002;
    vec3 ee=vec3(de,-de,0.0);
    
    vec3 col=colorImg1(z);
    col=col+colorImg1(z+ee.xx);
    col=col+colorImg1(z+ee.xy);
    col=col+colorImg1(z+ee.yx);
    col=col+colorImg1(z+ee.yy);
    col=col+colorImg1(z+ee.xz);
    col=col+colorImg1(z+ee.yz);
    col=col+colorImg1(z+ee.zx);
    col=col+colorImg1(z+ee.zy);
    col=col/9.0;
    return col;  

   }






vec2 addc(vec2 a, vec2 b){
   return vec2(a.x+b.x,a.y+b.y); 
}

vec2 subc(vec2 a, vec2 b){
   return vec2(a.x-b.x,a.y-b.y); 
}

vec2 negc(vec2 a){
   return vec2(-a.x,-a.y); 
}

vec2 multc(vec2 a, vec2 b){
   return vec2(a.x*b.x-a.y*b.y+0.0000000000000001,a.y*b.x+a.x*b.y); 
}

vec2 invc(vec2 a){
   float n=a.x*a.x+a.y*a.y;
   return vec2(a.x/n,-a.y/n); 
}

vec2 divc(vec2 a, vec2 b){
   return multc(a,invc(b));
}

vec2 expc(vec2 a){
    float n = exp(a.x);
    float r = n * cos(a.y);
    float i = n * sin(a.y);
    return vec2(r,i); 
}

vec2 cosc(vec2 a){

    float n = exp(a.y);
    float imag1 = n * sin(-a.x);
    float real1 = n * cos(-a.x);
    n = exp(-a.y);
    float imag2 = n * sin(a.x);
    float real2 = n * cos(a.x);
    float i = (imag1 + imag2) / 2.0;
    float r = (real1 + real2) / 2.0;

    return vec2(r,i); 
}
 
vec2 sinc(vec2 a){

    float n = exp(a.y);
    float imag1 = n * sin(-a.x);
    float real1 = n * cos(-a.x);
    n = exp(-a.y);
    float imag2 = n * sin(a.x);
    float real2 = n * cos(a.x);
    float r = -(imag1 - imag2) / 2.0;
    float i = (real1 - real2) / 2.0;

    return vec2(r,i); 
}
 
 
vec2 logc(vec2 a){
    float re=a.x;
    float im=a.y;
    float s = sqrt(re*re+im*im);
    float i = im;
    float imag = atan(im, re);
    if (i < 0.0) {
        imag += (2.0 * pi);
    }
    if (i == 0.0 && re < 0.0) {
        imag = pi;
    }
    if (imag > pi) {
        imag -= (2.0 * pi);
    };
    float real = log(s);    
 //   return CSNumber.snap({"ctype":"number" ,"value":{'real':real,'imag':imag}});
    return vec2(real,imag); 
}


vec2 powc(vec2 a, vec2 b){
    return expc(multc(logc(a),b));
}

vec2 sqrtc(vec2 a){
    return expc(multc(logc(a),vec2(0.5,0.0)));
}


vec2 arccosc(vec2 a){
    vec2  t2=multc(a,negc(a));
    vec2 tmp=sqrtc(addc(vec2(1.0,0.0),t2));
    vec2 tmp1=addc(multc(a,vec2(0.0,1.0)),tmp);
    vec2 erg=addc(multc(logc(tmp1),vec2(0.0,1.0)),vec2(pi*0.5,0.0));
    return erg;
}

vec2 arcsinc(vec2 a){
    vec2  t2=multc(a,negc(a));
    vec2 tmp=sqrtc(addc(vec2(1.0,0.0),t2));
    vec2 tmp1=addc(multc(a,vec2(0.0,1.0)),tmp);
    vec2 erg=multc(logc(tmp1),vec2(0.0,-1.0));
    return erg;
}

vec2 tanc(vec2 a){
    vec2 s=sinc(a);
    vec2 c=cosc(a);
    return divc(s,c);
}


vec2 arctanc(vec2 a){
    vec2 t1=logc(addc(multc(a,vec2(0.0,-1.0)),vec2(1.0,0.0)));
    vec2 t2=logc(addc(multc(a,vec2(0.0,1.0)),vec2(1.0,0.0)));
    vec2 erg=multc(subc(t1,t2),vec2(0.0,0.5));
    return erg;
}




    
 </script>



<script id='shader-fs-mainX' type='x-shader/x-fragment'>

</script>




<script id='shader-fs-postX' type='x-shader/x-fragment'>


vec3 mapping(vec2 z){

    vec2 za=vec2(posa.x,posa.y);
    vec2 zb=vec2(posb.x,posb.y);
    vec2 zc=vec2(posc.x,posc.y);
    vec2 zd=vec2(posd.x,posd.y);
    //vec2 e=vec2(pose.x,pose.y);
    
    vec2 a=subc(z,za)*10.0;
    vec2 b=subc(z,zb)*10.0;
    vec2 c=subc(z,zc)*10.0;
    vec2 d=subc(z,zd)*10.0;
    vec2 e=vec2(ee.x,ee.y);
    return colorImg1(ff(a,b,c,d,e));


}


void main( void ) {
    position = ((gl_FragCoord.xy-translate )/ scale);

    float alpha=1.0;
    pi=3.14159265359;
    vec3 color=vec3(0.0,0.0,1.0);
    vec2 z=vec2(position.x,position.y);
    float de=0.002;
    vec3 ee=vec3(de,-de,0.0);
    
    vec3 col=mapping(z);
  //  col=col+mapping(z+ee.xx);
  //  col=col+mapping(z+ee.xy);
  //  col=col+mapping(z+ee.yx);
  //  col=col+mapping(z+ee.yy);
  //  col=col+mapping(z+ee.xz);
  //  col=col+mapping(z+ee.yz);
  //  col=col+mapping(z+ee.zx);
  //  col=col+mapping(z+ee.zy);
  //  col=col/9.0;


color=col;

    gl_FragColor = vec4(color,alpha);
    
   

} 

</script>



<script type="text/javascript">

function setspeedConf(x)
{
    handleX.parameters.speed =x;
}

</script>

<script type="text/javascript">
  




</script>
<script id='app_cinderella_12_csinit' type='cindyscript'>
            use("WebGLExperiments");
            javascript("setuptextureConf()");

            WebGLvariables(posa->"point",posb->"point",posc->"point",posd->"point",nn->"point",sp->"point",ee->"point",sat->"point",hue->"point");

       grid1=true;   
        grid2=true;
        linear=false;   
        bw=false;   
        inp="a/b";
        stro="";
        reparse(inp):=(
              parse("text=compileToWebGL("+inp+")");
              errc(text);

   
             code="vec2 ff(vec2 a,vec2 b, vec2 c, vec2 d,vec2 e){ return "+text+";}";
             
            WebGLcode(code);
         //   WebGLcode();

          
        );
        reparse(inp);

dx=0.2;
dy=-0.2;
imgpos=(1.13,.1);
tiles=[
(imgpos,"Pic4"),
(imgpos+(dx,0),"Pic9"),
(imgpos+(dx*2,0),"Pic10"),
(imgpos+(0,dy),"Pic13"),
(imgpos+(dx,dy),"Pic16"),
(imgpos+(dx*2,dy),"Pic17"),
(imgpos+(0,dy*2),"Pic19"),
(imgpos+(dx,dy*2),"Pic20"),
(imgpos+(dx*2,dy*2),"Pic11")

];

sel=5;
          //  WebGLcode();

            
               
</script>

<script id='app_cinderella_12_csmouseup' type='cindyscript'>
mpos=mouse().xy;
apply(1..9,
  if(|mpos,tiles_#_1|<.1,
    sel=#;
    javascript("setup('app_cinderella_12/Tiles/"+tiles_#_2+".png')");
    );
);

</script>

<script id='app_cinderella_12_csmove' type='cindyscript'>
          x=S.x;
          if(x<S1.x,x=S1.x);
          if(x>S2.x,x=S2.x);
          S.xy=(x,S1.y);
          speed=S.x-S1.x;
          javascript("setspeedConf("+speed+");");
          sp=(speed,0);

          x=R.x;
          if(x<R1.x,x=R1.x);
          if(x>R2.x,x=R2.x);
          R.xy=(x,R1.y);
          
          x=T.x;
          if(x<T1.x,x=T1.x);
          if(x>T2.x,x=T2.x);
          T.xy=(x,T1.y);
          
         x=U.x; 
          if(x<U1.x,x=U1.x);
          if(x>U2.x,x=U2.x);
          U.xy=(x,U1.y);
          
          hue=(|U1,U|/|U1,U2|,0);
          sat=(|T1,T|/|T1,T2|,0);
            drawimage(S2+(0.03,-.04),S2+(0.09,0)+(0.03,-.04),"Rot");
            drawimage(T2+(0.03,-.01),T2+(0.09,0)+(0.03,-.01),"Sat");
            drawimage(R2+(0.03,-.02),R2+(0.09,0)+(0.03,-.02),"Grid");
            drawimage(U2+(0.03,-.01),U2+(0.09,0)+(0.03,-.01),"Hue");

        
        snap(cen,p):=(
          rad=.04;
          apply(-3..3++[0],
            draw(cen+(-3*rad,#*rad),cen+(+3*rad,#*rad),color->if(#==0,(1,1,1),(1,1,1)*.5),size->3);
            draw(cen+(#*rad,-3*rad),cen+(#*rad,+3*rad),color->if(#==0,(1,1,1),(1,1,1)*.5),size->3);
          );
          pp=round((p-cen)/rad);
          px=max(min(pp.x,3),-3);
          py=max(min(pp.y,3),-3);
          p.xy=(px,py)*rad+cen; 
          (px,py);
        );
        sa=snap((1.17,.8),AA);
        sb=snap((1.5,.8),BB);
        sc=snap((1.17,.45),CC);
        sd=snap((1.5,.45),DD);

        nn=(round(|R,R1|/|R2,R1|*12)+1,0);
          str=(
            "a^("+complex(sa)+")*"+
            "b^("+complex(sb)+")*"+
            "c^("+complex(sc)+")*"+
            "d^("+complex(sd)+")"
            );
   
        if(stro!=str,reparse(str);stro=str);
       
        ee=(0,0);

 		if(A.x>1,A.size=7;drawtext(A+(.03,.03),"A"),A.size=7);
        if(B.x>1,B.size=7;drawtext(B+(.03,.03),"B"),B.size=7);
        if(C.x>1,C.size=7;drawtext(C+(.03,.03),"C"),C.size=7);
        if(D.x>1,D.size=7;drawtext(D+(.03,.03),"D"),D.size=7);

       

          posa=A.xy;
          posb=B.xy;
          posc=C.xy;
          posd=D.xy;

ct=0;
apply(tiles,ct=ct+1;
  drawimage(#_1+(-.07,-.07),#_1+(.07,-.07),#_2,alpha->if(sel==ct,1,0.3));
  drawpoly([#_1+(-.08,-.08),#_1+(-.08,.08),#_1+(.08,.08),#_1+(.08,-.08)],alpha->if(sel==ct,1,0.3),
    color->if(sel==ct,(1,1,1),(1,1,1)*.4),size->3);
)

</script>


<script type="text/javascript">
       var uid2 = 'app_cinderella_10_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);


var setuptextureConf=function(){

  var image = new Image();
  image.src = "app_cinderella_12/Tiles/Pic16.png"; 
  image.onload = function() {
    setuptexture2Conf(image);
  }
}



var setuptexture2Conf=function(image){
      var gl=handleX.gl;
      var currentProgram=handleX.currentProgram;
      gl.useProgram(currentProgram);

  var texCoordBuffer = gl.createBuffer();
    var texCoordLocation = gl.getAttribLocation(currentProgram, "a_texCoord");

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
if(true){
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
} else {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
}

  // Upload the image into the texture.
  setRectangleConf(gl, 0, 0, image.width, image.height);
};


function setRectangleConf(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

   (function(){




(function() {


createCindy.registerPlugin(1,"WebGLExperiments",function(api){


// Greetings to Iq/RGBA! ;)
handleX={};
var  canvaswebgl, gl, buffer, currentProgram,
vertex_position, 
parameters = { 
start_time: Date.now(), 
timestamp: Date.now(), 
time: 0, 
mouseX: 0, mouseY: 0, 
screenWidth: 0, screenHeight: 0, 
speed:1.0,
varlist:["a","b"]
};
api.parameters=parameters;
var ispressed;
webglinfo={};
webglinfo.uniforms="";
webglinfo.typelist={};
webglinfo.code="";
handleX.parameters=parameters;
initConf();
animate();

function initConf() {
        var effect = document.createElement( 'div' );
        document.body.appendChild( effect );
                
        //canvas = document.createElement( 'canvas' );
                canvaswebgl=document.getElementById(uid2);
        //body.appendChild( canvas );
                
        
                
                
                
        // Initialise WebGL
                
        try {
                    
    gl = canvaswebgl.getContext("webgl") || canvaswebgl.getContext("experimental-webgl");
                    
        } catch( error ) { }
                
        if ( !gl ) {
                    
          alert("WebGL not supported");
          throw "cannot create webgl context";
                    
        }
                handleX.gl=gl;
        // Create Vertex buffer (2 triangles)
                
        buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );
                ispresses=false;
                
                
      //  compile();
                
        onWindowResize();
        window.addEventListener( 'resize', onWindowResize, false );
                
}

var texture;
  




api.defineFunction("WebGLvariables",0,function(args,modifs){
    var text="";
    
    for(var name in modifs) {
        var val=modifs[name];
        if(val.ctype=="string") { 
            type=val.value;
            if(type=="complex") {text=text+"uniform vec2 "+name+";\n";}
            if(type=="point") {text=text+"uniform vec2 "+name+";\n";}
            if(type=="real") {text=text+"uniform float "+name+";\n";}
            if(type=="homog") {text=text+"uniform vec3 "+name+";\n";}
            if(type=="point3D") {text=text+"uniform vec3 "+name+";\n";}
            if(type=="color") {text=text+"uniform vec3 "+name+";\n";}
            if(type=="colora") {text=text+"uniform vec4 "+name+";\n";}
            webglinfo.typelist[name]=type;
            
        }
    }
    webglinfo.uniforms=text;
}
);

api.defineFunction("WebGLcode",1,function(args,modifs){
    
    var val=api.evaluate(args[0]);
    if(val.ctype=="string") {
        webglinfo.code=val.value;
        compileConf(webglinfo.code)
    }
    
});

api.defineFunction("WebGLcode",0,function(args,modifs){
    
    compile()
    
});





function compileConf(text) {
        var program = gl.createProgram();
        var fragment0=document.getElementById("shader-fs-declareX").text;
        var fragment1=document.getElementById("shader-fs-preX").text;
        var fragment2=document.getElementById("shader-fs-mainX").text;
                if(text){
                  fragment2=text;
                }
        var fragment3=document.getElementById("shader-fs-postX").text;
        var fragment=fragment0+webglinfo.uniforms+fragment1+fragment2+fragment3;

        var vs = createShaderConf( 'attribute highp vec3 position; void main() { gl_Position = vec4( position, 1.0 ); }', gl.VERTEX_SHADER );
        var fs = createShaderConf( fragment, gl.FRAGMENT_SHADER );


              
                
        if ( vs == null || fs == null ) return null;
                
        gl.attachShader( program, vs );
        gl.attachShader( program, fs );
                
        gl.deleteShader( vs );
        gl.deleteShader( fs );
                
        gl.linkProgram( program );
                           console.log("GOT PROG");

        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
                    
          console.error( 'VALIDATE_STATUS: ' + gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'ERROR: ' + gl.getError() );
  
                    
          return;
                    
        }
                
        if ( currentProgram ) {
                    
          gl.deleteProgram( currentProgram );
        //  window.location.replace( '#' + encodeURIComponent( fragment ) );
                    
        }
                
        currentProgram = program;
                handleX.currentProgram=program;
                                           console.log("GOT PROG 2");

        //   console.log(currentProgram);
     
                
}

function createShaderConf( src, type ) {
        var shader = gl.createShader( type );
    
        gl.shaderSource( shader, src );
        gl.compileShader( shader );
                
                
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
                    
          var error = gl.getShaderInfoLog( shader );
                    
                    
          return null;
                    
        }
                
        return shader;
                
}

function onWindowResize( event ) {
    
    
        canvaswebgl.width = window.innerWidth;
        canvaswebgl.height = window.innerHeight;
        canvaswebgl.width = 1170;
        canvaswebgl.height = 1170;
                
        parameters.screenWidth = canvaswebgl.width;
        parameters.screenHeight = canvaswebgl.height;
                
        gl.viewport( 0, 0, canvaswebgl.width, canvaswebgl.height );
                
}

function animate() {
        requestAnimationFrame( animate );
        renderwegblConf();
                
}




function renderwegblConf() {
        if ( !currentProgram ) return;
    
        parameters.time = parameters.time +(Date.now() - parameters.timestamp)*parameters.speed;
        parameters.timestamp = Date.now();
                
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
                
        // Load program into GPU
                
        gl.useProgram( currentProgram );
                
                var initialmatrix=api.getInitialMatrix();

                gl.uniform1f( gl.getUniformLocation( currentProgram, 'time' ), parameters.time / 1000 );
                gl.uniform1f( gl.getUniformLocation( currentProgram, 'speed' ), 1.0 );

        gl.uniform2f( gl.getUniformLocation( currentProgram, 'mouse' ), parameters.mouseX, parameters.mouseY);
        gl.uniform2f( gl.getUniformLocation( currentProgram, 'translate' ),
                    initialmatrix.tx, 
                    initialmatrix.ty+canvaswebgl.height);
        gl.uniform1f( gl.getUniformLocation( currentProgram, 'scale' ), initialmatrix.sdet);

  
                for(var name in webglinfo.typelist) {
                    var aa=api.getVariable(name);
                    if(webglinfo.typelist[name]=="point") {
                        var xx=aa.value[0].value.real
                        var yy=aa.value[1].value.real;
                        gl.uniform2f( gl.getUniformLocation( currentProgram, name ), xx, yy);

                    }

                }
        gl.uniform2f( gl.getUniformLocation( currentProgram, 'resolution' ), 
                parameters.screenWidth, parameters.screenHeight );
                
        
                // Render geometry
                
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.vertexAttribPointer( vertex_position, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertex_position );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
        gl.disableVertexAttribArray( vertex_position );
                
}
})
})();


        var uid1 = 'app_cinderella_10_CSCanvas_' + new Date().getTime() + '_' + Math.floor((Math.random() * 100) + 1);
        document.write( "<canvas id=\"" + uid2 + "\" width=\"1170\" height=\"1170\"  style=\"position:absolute; top:0px; left:0px;z-index:1\"></canvas>" );
               document.write( "<canvas id=\"" + uid1 + "\" width=\"1560\" height=\"1170\" style=\"position:absolute; top:0px; left:0px;z-index:2\"></canvas>" );

 


var gslp=[
    {name:"A", type:"Free", pos:[-.5,0],color:[1,0,0],pinned:false,size:7},
    {name:"B", type:"Free", pos:[.5,0],color:[0,1,0],pinned:false,size:7},
    {name:"C", type:"Free", pos:[0,-0.5],color:[0,0,1],pinned:false,size:7},
    {name:"D", type:"Free", pos:[0,0.5],color:[1,1,0],pinned:false,size:7},
    {name:"AA", type:"Free", pos:[1.12,.8],color:[1,0,0],pinned:false,size:7},
    {name:"BB", type:"Free", pos:[1.55,.8],color:[0,1,0],pinned:false,size:7},
    {name:"CC", type:"Free", pos:[1.17,.45],color:[0,0,1],pinned:false,size:7},
    {name:"DD", type:"Free", pos:[1.5,.45],color:[1,1,0],pinned:false,size:7},
   {name:"S1", type:"Free", pos:[1.1,-.92],color:[1,1,1],pinned:true,size:0},
    {name:"S2", type:"Free", pos:[1.5,-.92],color:[1,1,1],pinned:true,size:0},
    {name:"S", type:"Free", pos:[1.15,-.92],color:[1,1,1],pinned:false,size:6},
    {name:"l", type:"Segment", args:["S1","S2"],color:[1,1,1],pinned:false,size:4},
   {name:"R1", type:"Free", pos:[1.1,-.79],color:[1,1,1],pinned:true,size:0},
    {name:"R2", type:"Free", pos:[1.5,-.79],color:[1,1,1],pinned:true,size:0},
    {name:"R", type:"Free", pos:[1.3,-.79],color:[1,1,1],pinned:false,size:6},
    {name:"m", type:"Segment", args:["R1","R2"],color:[1,1,1],pinned:false,size:4},
   {name:"T1", type:"Free", pos:[1.1,-.66],color:[1,1,1],pinned:true,size:0},
    {name:"T2", type:"Free", pos:[1.5,-.66],color:[1,1,1],pinned:true,size:0},
    {name:"T", type:"Free", pos:[2.0,-.66],color:[1,1,1],pinned:false,size:6},
    {name:"o", type:"Segment", args:["T1","T2"],color:[1,1,1],pinned:false,size:4},
   {name:"U1", type:"Free", pos:[1.1,-.53],color:[1,1,1],pinned:true,size:0},
    {name:"U2", type:"Free", pos:[1.5,-.53],color:[1,1,1],pinned:true,size:0},
    {name:"U", type:"Free", pos:[1.1,-.53],color:[1,1,1],pinned:false,size:6},
    {name:"oo", type:"Segment", args:["U1","U2"],color:[1,1,1],pinned:false,size:4}
       
    ];



var cdy = createCindy({
    ports: [{
    id: uid1,
    background: "rgba(0,0,0,0)",
    transform: [{visibleRect: [-1, 1,1.666666666 , -1]}]
  }],
     scripts:"app_cinderella_12_cs*",
    // mousedownscript:"click",
    // tickscript:"timer",
geometry:gslp,
 images:{
 Pic1:"app_cinderella_12/Tiles/Pic1.png",
 Pic2:"app_cinderella_12/Tiles/Pic2.png",
 Pic3:"app_cinderella_12/Tiles/Pic3.png",
 Pic4:"app_cinderella_12/Tiles/Pic4.png",
 Pic5:"app_cinderella_12/Tiles/Pic5.png",
 Pic6:"app_cinderella_12/Tiles/Pic6.png",
 Pic7:"app_cinderella_12/Tiles/Pic7.png",
 Pic8:"app_cinderella_12/Tiles/Pic8.png",
 Pic9:"app_cinderella_12/Tiles/Pic9.png",
 Pic10:"app_cinderella_12/Tiles/Pic10.png",
 Pic11:"app_cinderella_12/Tiles/Pic11.png",
 Pic12:"app_cinderella_12/Tiles/Pic12.png",
 Pic13:"app_cinderella_12/Tiles/Pic13.png",
 Pic14:"app_cinderella_12/Tiles/Pic14.png",
 Pic15:"app_cinderella_12/Tiles/Pic15.png",
 Pic16:"app_cinderella_12/Tiles/Pic16.png",
 Pic17:"app_cinderella_12/Tiles/Pic17.png",
 Pic18:"app_cinderella_12/Tiles/Pic18.png",
 Pic19:"app_cinderella_12/Tiles/Pic19.png",
 Pic20:"app_cinderella_12/Tiles/Pic20.png",
 Pic21:"app_cinderella_12/Tiles/Pic21.png",
 Pic22:"app_cinderella_12/Tiles/Pic22.png",
 Pic23:"app_cinderella_12/Tiles/Pic23.png",
 Rot:"app_cinderella_12/uiImages/Rot.png",
 Sat:"app_cinderella_12/uiImages/SSat.png",
 Grid:"app_cinderella_12/uiImages/Grid.png",
 Hue:"app_cinderella_12/uiImages/Hue.png"}
}
);
    })();

</script>
 

</div>
