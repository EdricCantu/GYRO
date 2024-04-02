const third = (Math.PI*2)/3;
const deg = Math.PI/180;

var move = 0; //0 is "none", 1 is "slider", 2 is "wheel"
var last = 0;
var rotation = 0;


function modrot(deg){
  rotation += deg;
  rotation %= 360;

  renderWheel(rotation,[-4,-3.5], ["222", "E03", "FB0", "06F"], [0,0,0], [90,90,90]);
}


slider.addEventListener("mousedown", e=>{move = 1});
view.addEventListener("mousedown", e=>{move = 2});
document.body.addEventListener("mouseup", e=>{
  move = 0;
});


document.body.addEventListener("mousemove", e=>{
  if(!move) return;//0 is "none"
  if(move==1){//1 is "slider"
    last = e.movementX / -1.5;
  }
  if(move==2){//1 is "slider"
    x1 = e.x - can.cx;
    y1 = e.y - can.cy;
    x2 = (e.x + e.movementX) - can.cx;
    y2 = (e.y + e.movementY) - can.cy;
    posOld = Math.atan2(y1,x1) / (Math.PI/180)
    posNew = Math.atan2(y2,x2) / (Math.PI/180)
    last = (posOld-posNew) * -2.6
  }
});

function anim(){
  modrot(last);
  last /= 1.01;
  if(Math.abs(last) < 5e-2) last = 0;
  requestAnimationFrame(anim);
}
requestAnimationFrame(anim);


can = view;

function refreshSize(){
  var bound = can.getBoundingClientRect();
  can.width = bound.width;
  can.height = bound.height;
}

refreshSize();
window.addEventListener("resize", refreshSize);
ctx = can.getContext("2d", {antialiasing: true});
ctx.fillStyle = "#ffffff";
Object.defineProperties(can, {
  w:{
    get(){
      return this.width;
    }
  },
  h:{
    get(){
      return this.height;
    }
  },
  cx:{
    get(){
      return this.w/2
    }
  },
  cy:{
    get(){
      return this.h/2
    }
  },
  qx:{
    get(){
      return this.w/4
    }
  },
  qy:{
    get(){
      return can.h/4
    }
  }
  
});

function renderWheel(rot, sizes, colors, balances, healths, center){
  opt = {
    rot:10,
    siz:10,//size of whole circle
    sec:[
      
      {
        col: "E03",
        siz: 100,
        noc:darkColor("E03") //no color
      },

      {
        col: "FB0",
        siz: 100,
        noc:darkColor("FB0") //no color
      },
      {
        col: "06F",
        siz: 100,
        noc:darkColor("06F") //no color
      }
    ],
    mid:{
      col:"222",
      siz:"",
      sho:"",
      pie: {
        value: "",
        color:""
      },
    }
  }
  //sizes       = radiuses[centerSize,             circleSize      ]
  //colors      =   base16[centerColor,      sectr1, sectr2, sectr3]
  //balances    =  degrees[                  break1, break2, break3]
  //healths     = percents[                  sectr1, sectr2, sectr3]

  //centerImage =         [centerPie, centerLoad, centerImage]
  refreshSize();
  [centerSize, circleSize] = sizes;
  if(circleSize < 0) circleSize = Math.min(can.w,can.h) / -circleSize;
  if(centerSize < 0) centerSize = circleSize / -centerSize;
  
  balances = balances.map(balance=>(deg*balance)+(deg*rot));
  colors = colors.map(color=>(color[0]=="#")?(color):("#"+color))
  healths = healths.map(health=>health/100);

  ctx.beginPath();//first sector health
    ctx.fillStyle = darkColor(colors[1]);
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize, balances[2], balances[0]+third);
    ctx.fill(); 
  ctx.beginPath();//first sector healthdraw
    ctx.fillStyle = colors[1];
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize*healths[0], balances[2], balances[0]+third);
    ctx.fill(); 


  ctx.beginPath();
    ctx.fillStyle = darkColor(colors[2]);
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize, balances[0]+third, balances[1]+third*2);
    ctx.fill(); 
  ctx.beginPath();
    ctx.fillStyle = colors[2];
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize*healths[1], balances[0]+third, balances[1]+third*2);
    ctx.fill(); 


  ctx.beginPath();
    ctx.fillStyle = darkColor(colors[3]);
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize, balances[1]+third*2, balances[2]);
    ctx.fill(); 
  ctx.beginPath();
    ctx.fillStyle = colors[3];
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, circleSize*healths[2], balances[1]+third*2, balances[2]);
    ctx.fill(); 

    ctx.beginPath();
    ctx.fillStyle = colors[0];
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, centerSize, third*3, 0);
    ctx.fill(); 
} 

function darkColor(color){
  var hasHash = color[0] === "#"
  if(hasHash) color = color.slice(1);
  var r,g,b;
  if(color.length == 6){
    r = parseInt(color.slice(0,2), 16);
    g = parseInt(color.slice(2,4), 16);
    b = parseInt(color.slice(4,6), 16);
    r = Math.ceil( r / 2 ); //i want to avoid black, chose ceil instead of floor
    g = Math.ceil( g / 2 ); //integer to avoid decimal in output
    b = Math.ceil( b / 2 );
    r = r.toString(16).padStart(2,0)
    g = g.toString(16).padStart(2,0)
    b = b.toString(16).padStart(2,0)
  }
  if(color.length == 3){
    r = parseInt(color[0], 16);
    g = parseInt(color[1], 16);
    b = parseInt(color[2], 16);
    r = Math.ceil( r / 1.5 ); //i want to avoid black, chose ceil instead of floor
    g = Math.ceil( g / 1.5 ); //integer to avoid decimal in output
    b = Math.ceil( b / 1.5 );
    r = r.toString(16)
    g = g.toString(16)
    b = b.toString(16)
  }
  
  return (hasHash?"#":"")+r+g+b
}

/* 
3 balls, same color, same angle, same distance
360 spinning wheel, same color moving
360 spinning wheel, diff color staying
2 balls, diff color, diff angle same distance
2 balls, same color, diff angle same distance
*/


function renderArc(color, radius, angleFrom, angleTo){
  ctx.beginPath();
    if(color[0] !== "#") color = "#" + color
    ctx.fillStyle = colors;
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, radius, angleFrom*deg, angleTo*deg);
  ctx.fill(); 
}
function renderHealthedArc(color, radius, angleFrom, angleTo, health){
  health /= 100; // convert health 0-100 (%) to health 0-1 (fractional)
  renderArc(darkColor(color), radius*health, angleFrom, angleTo) //dark
  renderArc(color, radius, angleFrom, angleTo) //light
}
