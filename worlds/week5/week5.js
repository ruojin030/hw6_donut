"use strict"


const VERTEX_SIZE = 6; // EACH VERTEX CONSISTS OF: x,y,z, ny,ny,nz


 //////////////////////////////////////////////////////////////////
//                                                                //
//  FOR HOMEWORK, YOU CAN ALSO TRY DEFINING DIFFERENT SHAPES,     //
//  BY CREATING OTHER VERTEX ARRAYS IN ADDITION TO cubeVertices.  //
//                                                                //
 //////////////////////////////////////////////////////////////////

let createCubeVertices = () => {
   let v = [];
   let addVertex = a => {
      for (let i = 0 ; i < a.length ; i++)
         v.push(a[i]);
   }

   // EACH SQUARE CONSISTS OF TWO TRIANGLES.

   let addSquare = (a,b,c,d) => {
      addVertex(c);
      addVertex(b);
      addVertex(a);

      addVertex(b);
      addVertex(c);
      addVertex(d);
   }

   // VERTEX DATA FOR TWO OPPOSING SQUARE FACES. EACH VERTEX CONSISTS OF: x,y,z, nx,ny,nz

   let P = [[-1,-1,-1, 0,0,-1],[ 1,-1,-1, 0,0,-1],[-1, 1,-1, 0,0,-1],[ 1, 1,-1, 0,0,-1],
            [-1,-1, 1, 0,0, 1],[ 1,-1, 1, 0,0, 1],[-1, 1, 1, 0,0, 1],[ 1, 1, 1, 0,0, 1]];

   // LOOP THROUGH x,y,z. EACH TIME ADD TWO OPPOSING FACES, THEN PERMUTE COORDINATES.

   for (let n = 0 ; n < 3 ; n++) {
      addSquare(P[0],P[1],P[2],P[3]);
      addSquare(P[4],P[5],P[6],P[7]);
      for (let i = 0 ; i < P.length ; i++)
         P[i] = [P[i][1],P[i][2],P[i][0], P[i][4],P[i][5],P[i][3]];
   }

   return v;
}

let createPyramidVertices = ()=>{
    let v = [];

    let addVertex = (a,b) =>{
        for(let i = 0; i< a.length; i++){
            v.push(a[i]);
        }
        for(let i = 0;i <b.length;i++){
            v.push(b[i])
        }
    }
    let addTriangle = (a,b,c,d)=>{
        addVertex(a,d);
        addVertex(b,d);
        addVertex(c,d);
    }
    let sqrt2 = Math.sqrt(2);
    let sqrt3 = Math.sqrt(3);
    //let pt=[[0,0,-1],[1,0,0.5],[-1,0,0.5]];
    //let N = [[0,1,0]];
    let pt = [[0,sqrt2/sqrt3,0],[1/2,0,sqrt3/6],[-1/2,0,sqrt3/6],[0,0,-sqrt3/3]]; //A B C D
    let N = [[0,1/(2*sqrt3),sqrt2/sqrt3],[1/sqrt2,1/(2*sqrt3),-1/(sqrt2*sqrt3)],[-1/sqrt2,1/(2*sqrt3),-1/(sqrt2*sqrt3)],[0,-1,0]];
    addTriangle(pt[1],pt[0],pt[2],N[0]);
    addTriangle(pt[3],pt[0],pt[1],N[1]);
    addTriangle(pt[2],pt[0],pt[3],N[2]);
    addTriangle(pt[1],pt[3],pt[2],N[3]);
    return v;
};

let createMesh = (M,N,callback)=>{
    let res = [];
    for(let n = 0;n< N;n+=2){       
        
        for(let i = 2*M-1;i>=0*M;i--){ 
            let u = Math.floor(i/2)/(M-1);
            let arr = [];         
            if(i%2 == 1){                
                let v = (n)/(N-1);
                arr = callback(u,v)
            }else{
                let v = (n+1)/(N-1);
                arr = callback(u,v)
            }
            res =res.concat(arr);
        }
        for(let i = 0;i<2*M;i++){ 
            let u = Math.floor(i/2)/(M-1); 
            let arr = [];        
            if(i%2 == 0){                
                let v = (n+1)/(N-1);
                arr = callback(u,v);
            }else{
                let v = (n+2)/(N-1);
                arr = callback(u,v);
            }
            res = res.concat(arr);
        }
    }
    
    return res;
}
let sphere = (u,v)=>{
    let theta = Math.PI*2*u;
    let phi = Math.PI*v-Math.PI/2;
    let x = Math.cos(theta)* Math.cos(phi);
    let y = Math.sin(theta)* Math.cos(phi);
    let z = Math.sin(phi);
    return [x,y,z,x,y,z];
}

let torus = (u,v)=>{
    let theta = 2*Math.PI*u;
    let phi = 2*Math.PI*v;
    let r = 0.5;
    let x = Math.cos(theta)*(1+r*Math.cos(phi));
    let y = Math.sin(theta)*(1+r*Math.cos(phi));
    let z = r*Math.sin(phi);
    let nx = Math.cos(theta)*Math.cos(phi);
    let ny = Math.sin(theta)*Math.cos(phi);
    let nz = Math.sin(phi);
    return [x,y,z, nx,ny,nz];
}

let uvToTube = (u,v)=>{
    let theta = 2*Math.PI*u;
    let x = Math.cos(theta);
    let y = Math.sin(theta);
    let z = 2*v-1
}

let uvToCylinder = (u,v) =>{
    let c = Math.cos(2*Math.PI*u);
    let s = Math.sin(2*Math.PI*u);
    let z = Math.max(-1, Math.min(1, 10*v - 5))

    switch (Math.floor(5.001 * v)) {
    case 0: case 5: return [ 0,0,z, 0,0,z ] // center of back/front end cap
    case 1: case 4: return [ c,s,z, 0,0,z ] // perimeter of back/front end cap
    case 2: case 3: return [ c,s,z, c,s,0 ] // back/front of cylindrical tube
    }
}

let sphereVertices = createMesh(30,30,sphere);
let torusVertices = createMesh(50,50,torus);
let tubeVertices = createMesh(20,20,uvToTube)
let cylinderVertices = createMesh(30,6,uvToCylinder);


let cubeVertices = createCubeVertices();
let pyramidVertices = createPyramidVertices();



async function setup(state) {
    hotReloadFile(getPath('week5.js'));

    state.m = new Matrix();

    let libSources = await MREditor.loadAndRegisterShaderLibrariesForLiveEditing(gl, "libs", [
        { 
            key : "pnoise", path : "shaders/noise.glsl", foldDefault : true
        },
        {
            key : "sharedlib1", path : "shaders/sharedlib1.glsl", foldDefault : true
        },      
    ]);

    if (!libSources) {
        throw new Error("Could not load shader library");
    }

    // load vertex and fragment shaders from the server, register with the editor
    let shaderSource = await MREditor.loadAndRegisterShaderForLiveEditing(
        gl,
        "mainShader",
        { 
            onNeedsCompilation : (args, libMap, userData) => {
                const stages = [args.vertex, args.fragment];
                const output = [args.vertex, args.fragment];

                const implicitNoiseInclude = true;
                if (implicitNoiseInclude) {
                    let libCode = MREditor.libMap.get("pnoise");

                    for (let i = 0; i < 2; i += 1) {
                        const stageCode = stages[i];
                        const hdrEndIdx = stageCode.indexOf(';');
                        
                        /*
                        const hdr = stageCode.substring(0, hdrEndIdx + 1);
                        output[i] = hdr + "\n#line 1 1\n" + 
                                    libCode + "\n#line " + (hdr.split('\n').length) + " 0\n" + 
                                    stageCode.substring(hdrEndIdx + 1);
                        console.log(output[i]);
                        */
                        const hdr = stageCode.substring(0, hdrEndIdx + 1);
                        
                        output[i] = hdr + "\n#line 2 1\n" + 
                                    "#include<pnoise>\n#line " + (hdr.split('\n').length + 1) + " 0" + 
                            stageCode.substring(hdrEndIdx + 1);

                        //console.log(output[i]);
                    }
                }

                MREditor.preprocessAndCreateShaderProgramFromStringsAndHandleErrors(
                    output[0],
                    output[1],
                    libMap
                );
            },
            onAfterCompilation : (program) => {
                state.program = program;

                gl.useProgram(program);

                state.uColorLoc        = gl.getUniformLocation(program, 'uColor');
                state.uCursorLoc       = gl.getUniformLocation(program, 'uCursor');
                state.uModelLoc        = gl.getUniformLocation(program, 'uModel');
                state.uProjLoc         = gl.getUniformLocation(program, 'uProj');
                state.uTimeLoc         = gl.getUniformLocation(program, 'uTime');
                state.uViewLoc         = gl.getUniformLocation(program, 'uView');

                state.uMaterialLoc                = {}
                state.uMaterialLoc.diffuse        = gl.getUniformLocation(program, 'uMaterial.diffuse');
                state.uMaterialLoc.ambient        = gl.getUniformLocation(program, 'uMaterial.ambient');
                state.uMaterialLoc.specular       = gl.getUniformLocation(program, 'uMaterial.specular');
                state.uMaterialLoc.power          = gl.getUniformLocation(program, 'uMaterial.power');
                
            } 
        },
        {
            paths : {
                vertex   : "shaders/vertex.vert.glsl",
                fragment : "shaders/fragment.frag.glsl"
            },
            foldDefault : {
                vertex   : true,
                fragment : false
            }
        }
    );

    state.cursor = ScreenCursor.trackCursor(MR.getCanvas());

    if (!shaderSource) {
        throw new Error("Could not load shader");
    }

    // Create a square as a triangle strip consisting of two triangles
    state.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);

 ///////////////////////////////////////////////////////////
//                                                         //
//  HINT: IF YOU WANT TO IMPLEMENT MORE THAN ONE SHAPE,    //
//  YOU MIGHT WANT TO CALL gl.bufferData()                 //
//  MULTIPLE TIMES IN onDraw() INSTEAD OF HERE,            //
//  USING OTHER ARRAY VALUES IN ADDITION TO cubeVertices.  //
//                                                         //
 ///////////////////////////////////////////////////////////

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);

    let bpe = Float32Array.BYTES_PER_ELEMENT;

    let aPos = gl.getAttribLocation(state.program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, bpe * VERTEX_SIZE, bpe * 0);

    let aNor = gl.getAttribLocation(state.program, 'aNor');
    gl.enableVertexAttribArray(aNor);
    gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, bpe * VERTEX_SIZE, bpe * 3);
}


 /////////////////////////////////////////////////////////////////////
//                                                                   //
//  FOR HOMEWORK, YOU NEED TO IMPLEMENT THESE SIX MATRIX FUNCTIONS.  //
//  EACH FUNCTION SHOULD RETURN AN ARRAY WITH 16 VALUES.             //
//                                                                   //
//  SINCE YOU ALREADY DID THIS FOR THE PREVIOUS ASSIGNMENT,          //
//  YOU CAN JUST USE THE FUNCTION DEFINITIONS YOU ALREADY CREATED.   //
//                                                                   //
 /////////////////////////////////////////////////////////////////////

let identity = ()       => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
let rotateX = t         => [1,0,0,0, 0,Math.cos(t),Math.sin(t),0, 0,-Math.sin(t),Math.cos(t),0, 0,0,0,1];
let rotateY = t         => [Math.cos(t),0,-Math.sin(t),0, 0,1,0,0, Math.sin(t),0,Math.cos(t),0, 0,0,0,1];
let rotateZ = t         => [Math.cos(t),Math.sin(t),0,0, -Math.sin(t),Math.cos(t),0,0, 0,0,1,0, 0,0,0,1];
let scale = (x,y,z)     => [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
let translate = (x,y,z) => [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];

let inverse = src => {
  let dst = [], det = 0, cofactor = (c, r) => {
     let s = (i, j) => src[c+i & 3 | (r+j & 3) << 2];
     return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
                                 - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
                                 + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
  }
  for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
  for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
  for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
  return dst;
}

let multiply = (a, b) => {
   let c = [];
   for (let n = 0 ; n < 16 ; n++)
      c.push( a[n&3     ] * b[    n&12] +
              a[n&3 |  4] * b[1 | n&12] +
              a[n&3 |  8] * b[2 | n&12] +
              a[n&3 | 12] * b[3 | n&12] );
   return c;
}

let Material = function(a,d,s,p){
    let ambient  = a;
    let diffuse  = d;
    let specular = s;
    let power    = p;  
    this.ambient = () =>ambient;
    this.diffuse = () =>diffuse;
    this.specular= () =>specular;
    this.power   = () =>power;
}

let setMaterial = (loc,m) => {
    gl.uniform3fv(loc.ambient , m.ambient ());
    gl.uniform3fv(loc.diffuse , m.diffuse ());
    gl.uniform3fv(loc.specular, m.specular());
    gl.uniform1f (loc.power   , m.power   ())
}

let Matrix = function() {
   let topIndex = 0,
       stack = [ identity() ],
       getVal = () => stack[topIndex],
       setVal = m => stack[topIndex] = m;

   this.identity  = ()      => setVal(identity());
   this.restore   = ()      => --topIndex;
   this.rotateX   = t       => setVal(multiply(getVal(), rotateX(t)));
   this.rotateY   = t       => setVal(multiply(getVal(), rotateY(t)));
   this.rotateZ   = t       => setVal(multiply(getVal(), rotateZ(t)));
   this.save      = ()      => stack[++topIndex] = stack[topIndex-1].slice();
   this.scale     = (x,y,z) => setVal(multiply(getVal(), scale(x,y,z)));
   this.translate = (x,y,z) => setVal(multiply(getVal(), translate(x,y,z)));
   this.value     = ()      => getVal();
}
let materials = [new Material([0.7,0.1,0.3],[0.8,0.1,0.3],[0.3,0.3,0.3],10),//pink
                 new Material([0.5,0.5,0.1],[0.8,0.8,0.1],[0.5,0.5,0.3],10),//yellow
                 new Material([0,0.5,0.2],[0,0.5,0.2],[0.3,0.3,0.3],10),//green
                 new Material([.8,.8,.8],[1,1,1],[1,1,1],10), //white
                 new Material([0,0.1,0.6],[0,0.3,0.8],[0.4,0.4,0.4],10)]; //blue

let material = new Material([0.8,0.3,0.5],[0.8,0.3,0.5],[0.3,0.3,0.3],10)
let box_color = new Material([0.7,0.7,0.7],[0.9,0.9,0.9],[1.0,1.0,1.],10)

let dounutColor = new Material([0.5,0.4,0.1],[0.9,0.6,0.4],[0.3,0.3,0.3],10);



function onStartFrame(t, state) {

    state.color0 = [1,.5,.2];


    // uTime IS TIME IN SECONDS SINCE START TIME.
    if (!state.tStart)
        state.tStart = t;
    state.time = (t - state.tStart) / 1000;

    gl.uniform1f (state.uTimeLoc  , state.time);
    
    //setMaterial(state.uMaterialLoc, materials[Math.floor((state.time*10)/5)%6]);
    setMaterial(state.uMaterialLoc,material);


    // uCursor WILL GO FROM -1 TO +1 IN xy, WITH z = 0 FOR MOUSE UP, 1 FOR MOUSE DOWN.

    let cursorValue = () => {
       let p = state.cursor.position(), canvas = MR.getCanvas();
       return [ p[0] / canvas.clientWidth * 2 - 1, 1 - p[1] / canvas.clientHeight * 2, p[2] ];
    }

    gl.uniform3fv(state.uCursorLoc, cursorValue());
    //console.log(cursorValue());


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
}

function catWalk(state,m,speed){
    m.save()
    let theta = Math.sin(speed * state.time)/2;
    let theta1 = Math.sin(speed * (state.time))/2;
    let theta3 = Math.sin(speed/2 * state.time)/2;
    let theta4 = Math.sin(speed/2 * state.time)/2;
    
    let b_x = 0.8, b_y = 0.3, b_z = 0.3
    let h_x = 0.2, h_y = 0.2, h_z = 0.25
    let e_size = 0.15;
    let l_x = 0.06,l_y = 0.25,l_z = 0.06;
    let p_x = 0.07, p_y = 0.03, p_z = l_z;
    let tail_x = 0.1,tail_y = 0.04,tail_z = tail_y;
    m.save(); //body
        m.scale(b_x,b_y,b_z);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
    m.restore();
    m.save(); //head
        m.translate(h_x+b_x,0.2,0);
        m.save();
            m.scale(h_x,h_y,h_z);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
            gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
            gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
        m.restore();
        for(let i = -1; i<2;i+=2){//ear
            m.save();
                m.translate(h_x-0.3*e_size,h_y,i*0.6*h_z);
                m.rotateY(30*(180/Math.PI));
                m.scale(e_size,e_size,e_size);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( pyramidVertices ), gl.STATIC_DRAW);
                gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                gl.drawArrays(gl.TRIANGLES, 0, pyramidVertices.length/VERTEX_SIZE);
            m.restore()
        }
    m.restore()
    m.save()
        for(let i = -1; i<2 ; i+=2){
            m.save()
                m.translate(b_x-l_x-0.01,-(b_y-(b_y-l_y)-0.02),i*(b_z-l_z));
                m.rotateZ (0.2);
                m.rotateZ(i*theta);
                m.translate(0,-b_y,0);
                m.save()
                    m.scale(l_x,l_y,l_z);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                    gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
                m.restore()
                    m.translate(0.01,-l_y+0.02,0)
                    m.scale(p_x,p_y,p_z);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                    gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
            m.restore()
            m.save()
                m.translate(-(b_x-2*l_x),-(b_y-0.5*l_y-0.02),i*(b_z-l_z));
                m.rotateZ(-0.5)
                m.rotateZ(i*(theta1));
                m.translate(0,-(b_y-0.06),0);
                m.save()
                    m.scale(l_x,l_y*0.4,l_z);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                    gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
                m.restore()
                m.translate(0,-(l_y*0.4),0);
                m.rotateZ(1);
                m.translate(0,-(l_y*0.7-0.02),0);
                m.save()               
                    m.scale(l_x,l_y*0.7,l_z);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                    gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
                m.restore();
                    m.translate(0,-l_y+0.07,0)
                    m.rotateZ(-0.8)
                    m.scale(p_x,p_y,p_z);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                    gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
            m.restore()
        }
    m.restore()
    m.translate(-b_x,(b_y-0.05),0)
    m.save()
        for(let i = 1;i<6;i++){
            let a = 1;
            if(i!= 1){
                m.translate(-tail_x,0,0);
                a = 2
            }
            m.rotateY(theta3/a)
            m.rotateZ(theta4/a)
            m.translate(-tail_x,0,0);
            m.save()
                m.scale(tail_x,tail_y,tail_z);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);
                gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
            m.restore()
        }
    m.restore()
    m.restore()

}

function dancingBalloonMan(state,m){
    setMaterial(state.uMaterialLoc,material);
    let cursorValue = () => {
        let p = state.cursor.position(), canvas = MR.getCanvas();
        return [ p[0] / canvas.clientWidth * 2 - 1, 1 - p[1] / canvas.clientHeight * 2, p[2] ];
    }
    let theta = Math.sin(5 * state.time);
    let x = 0.1;
    let y = 0.4;
    let z = 0.1;
    m.translate(0,-1,0);   
    for(let num = 1;num<5;num++){
        if(cursorValue()[2]){
            //console.log(m.value());
            let x_c = cursorValue()[0]*(-m.value()[14]/2);
            let y_c = cursorValue()[1]*(-m.value()[14]/2);
            console.log("x:"+x_c+"y:"+y_c+"angle:"+Math.atan2(y_c,x_c));
            //m.translate(x,y,0);
            m.rotateZ((Math.atan2(y_c,x_c)-1.5)/3);
        }else{
            m.rotateZ(Math.cos(state.time)/2);  
        }    
        m.save();  
            m.translate(x,y,0);     
            m.scale(x,y,z);
        //m.translate(Math.sin(state.time),Math.cos(state.time),-6);
        //m.rotateX(Math.cos(state.time));
            gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
            gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
        m.restore();
          
        if(num == 4){  
            m.translate(0.25*y,0,0)          
            for( let i = -1;i<2;i+=2){
                let y = 0.26
                m.save(); 
                    //m.translate(0,-x,z);
                    m.rotateZ(theta*i);
                    m.translate(i*y,0,0);
                    m.save();
                        m.scale(y,x,z);
                        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
                    m.restore()
                    m.translate(i*y,0,0)
                    m.rotateZ(theta*i);
                    m.translate(i*y,0,0);
                    m.save();
                        m.scale(y,x,z);
                        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
                        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length/VERTEX_SIZE);
                    m.restore()
                m.restore();
            }
        }       
        m.translate(0, 2*y, 0);
    }

}
function dounutSugar(state,m){
    let drawShape = (material, type, vertices) => {
        setMaterial (state.uMaterialLoc,material);
        gl.uniformMatrix4fv(state.uModelLoc, false, m.value());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(type, 0, vertices.length / VERTEX_SIZE);
    }

        //m.rotateY(state.time);
        let sugarAngel= [Math.PI*0.1,Math.PI*0.2,Math.PI*0.3, Math.PI*0.4];
        let sugarR = [0.35,0.28,0.35,0.28];
        let angel = [1,-0.5,0.5];
        let k = 1;
        for(let i = 0; i<sugarAngel.length;i++){
            let xPos = sugarR[i]*Math.cos(sugarAngel[i]);
            let yPos = sugarR[i]*Math.sin(sugarAngel[i]);
            console.log(xPos, yPos);
            for(let x = -1;x<2;x+=2){
                for(let y = -1; y<2;y+=2){
                    m.save()
                    m.translate(x*xPos,0,y*yPos)
                    console.log(angel[(i)%2]);
                    m.rotateY(angel[(k++)%3]);
                    m.scale(.01,.01,.04);
                    drawShape(materials[(k++)%materials.length], gl.TRIANGLE_STRIP, cylinderVertices);
                    m.restore()
                }
            }
        }

}



function onDraw(t, projMat, viewMat, state, eyeIdx) {
    gl.uniformMatrix4fv(state.uViewLoc, false, new Float32Array(viewMat));
    gl.uniformMatrix4fv(state.uProjLoc, false, new Float32Array(projMat));
    let drawShape = (material, type, vertices) => {
        setMaterial (state.uMaterialLoc,material);
        gl.uniformMatrix4fv(state.uModelLoc, false, m.value());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(type, 0, vertices.length / VERTEX_SIZE);
    }
    
    let m = state.m;
        let timer =(state.time)*1.5%10;
        let dountDrop = timer >=0 && timer <=2;
        let dountStay = timer >=2 && timer <=9;
        let creamDrop = timer >=2 && timer <=4;
        let creamStay = timer >=4 && timer <=9;
        let sugarDrop = timer >=4 && timer <=6;
        let sugarStay = timer >=6 && timer <=9;
        let box1_close = timer >=6 && timer <=7;
        let box1_stay = timer >=7 && timer <=10;
        let box2_close = timer >=7 && timer <=8;
        let box2_stay = timer >=8 && timer <=10;
        let box1_close_fb = timer >=7 && timer <=8;
        let box1_stay_fb = timer >=8 && timer <=10;
        let box2_close_fb = timer >=8 && timer <=9;
        let box2_stay_fb = timer >=9 && timer <=10;
        let box_move = timer>=9 && timer <=10;
        let box_move_in = timer>=0&& timer<=1;

        

        m.identity();
        m.save()
            m.translate(0,0,-5);
            //m.rotateX(1.5)
            if(dountStay){
                m.translate(0,-1,0)
            }
            else if(dountDrop){ //(0,2)
                m.translate(0,1-timer,0);
            }else{
                m.translate(0,-3,0)
            }
            //m.translate(0,-1,0)
            m.rotateX(-Math.PI/2);    
            m.scale(.4,.4,.4);
            drawShape(dounutColor, gl.TRIANGLE_STRIP, torusVertices);       
        m.restore();
        m.save();
            m.identity();
            m.translate(0,0,-5);
            if(creamStay){
                m.translate(0,0.17-1,0)
            }
            else if(creamDrop){ //(2,4)
                m.translate(0,3+0.17-timer,0);
            }else{
                m.translate(0,-3,0)
            }
            m.rotateX(-Math.PI/2); 
            m.scale(.33,.33,.08);
            drawShape(material, gl.TRIANGLE_STRIP, torusVertices); 
        m.restore()      
        m.save();
            m.identity();
            m.translate(0,0,-4.9);
            if(sugarStay){
                m.translate(0,0.22-1,0)
            }
            else if(sugarDrop){ //(4,6)
                m.translate(0,5+0.22-timer,0);
            }else{
                m.translate(0,-3,0)
            }
            //m.rotateX(1.5)
            dounutSugar(state,m);
        m.restore()
        //box
        let box_x = 0.8,box_y = 0.3,box_z = 0.01
        m.identity();
        if(box_move){
            m.translate((timer-9)*5,0,0)
        }else if(box_move_in){
            m.translate((timer-1)*5,0,0)
        }
        m.translate(0,-1.2,-5);
        //m.translate(0,0,-1)
        //m.rotateY(state.time);
        m.save()
            m.scale(box_x,box_z,box_x);
            drawShape(box_color,gl.TRIANGLES, cubeVertices);
        m.restore()
        for(let i = -1;i<2;i+=2){      
            m.save()
                if(box1_close){//(6,7)
                    let t = (timer-6)*Math.PI/2;
                    m.translate(box_x*i,0,0);
                    m.rotateZ(t*i);
                    m.translate(box_y*i,0,0);
                }else if(box1_stay){
                    m.translate(box_x*i,0,0);
                    m.rotateZ(Math.PI*0.5*i);
                    m.translate(box_y*i,0,0);
                }else{
                    m.translate(i*(box_x+box_y),0,0);
                }
                m.save()
                    m.scale(box_y,box_z,box_x);
                    drawShape(box_color,gl.TRIANGLES, cubeVertices);
                m.restore()
                if(box2_close){//(7,8)
                    let t = (timer-7)*Math.PI/2
                    m.translate(box_y*i,0,0);
                    m.rotateZ(t*i);
                    m.translate(box_x*0.45*i,0,0); 
                }else if(box2_stay){
                    m.translate(box_y*i,0,0);
                    m.rotateZ(Math.PI/2*i);
                    m.translate(box_x*0.45*i,0,0); 
                }else{
                    m.translate((box_y+(box_x*0.45))*i,0,0);
                }                              
                m.save()
                    m.scale(box_x*0.45,box_z,box_x);
                    drawShape(box_color,gl.TRIANGLES, cubeVertices);
                m.restore()
            m.restore()
        }
        for(let i = -1;i<2;i+=2){      
            m.save()
                if(box1_close_fb){//(7,8)
                    let t = (timer-7)*Math.PI/2;
                    m.translate(0,0,box_x*i);
                    m.rotateX(-t*i);
                    m.translate(0,0,box_y*i);
                }else if(box1_stay_fb){
                    m.translate(0,0,box_x*i);
                    m.rotateX(-Math.PI*0.5*i);
                    m.translate(0,0,box_y*i);
                }else{
                    m.translate(0,0,i*(box_x+box_y));
                }
                m.save()
                    m.scale(box_x,box_z,box_y);
                    drawShape(box_color,gl.TRIANGLES, cubeVertices);
                m.restore()
                if(box2_close_fb){//(8,9)
                    let t = (timer-8)*Math.PI/2
                    m.translate(0,0,box_y*i);
                    m.rotateX(-t*i);
                    m.translate(0,0,box_x*0.45*i); 
                }else if(box2_stay_fb){
                    m.translate(0,0,box_y*i);
                    m.rotateX(-Math.PI/2*i);
                    m.translate(0,0,box_x*0.45*i,); 
                }else{
                    m.translate(0,0,(box_y+box_x*0.45)*i);
                }                               
                m.save()
                    m.scale(box_x,box_z,box_x*0.45);
                    drawShape(box_color,gl.TRIANGLES, cubeVertices);
                m.restore()
            m.restore()
        }
        
}

function onEndFrame(t, state) {
}

export default function main() {
    const def = {
        name         : 'week5',
        setup        : setup,
        onStartFrame : onStartFrame,
        onEndFrame   : onEndFrame,
        onDraw       : onDraw,
    };

    return def;
}
