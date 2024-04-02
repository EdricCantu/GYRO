const third = (Math.PI*2)/3;
const deg = Math.PI/180;

var move = 0; //0 is "none", 1 is "slider", 2 is "wheel"
var last = 0;
var rotation = 0;

circle = -3.5
function modrot(deg){
  rotation += deg;
  rotation %= 360;

  renderWheel(rotation,[-4,circle],  ["222", "C15", "DA3", "08D"], [0,0,0], [90,90,90]);//["222", "E03", "FB0", "06F"]
}
can = view;

function refreshSize(){
  var bound = can.getBoundingClientRect();
  can.width = bound.width;
  can.height = bound.height;
}
function anim(){
  refreshSize();
  modrot(last);
  //last = Math.sign(last) * (Math.abs(last) ** 0.99);
  //last = Math.sign(last)  * (Math.abs(last*2) ** 0.5)
  last = calcNextLast(last)
  if(Math.abs(last) < 5e-2) last = 0;
  requestAnimationFrame(anim);
}
requestAnimationFrame(anim);


slider.addEventListener("mousedown", e=>{move = 1});
slider.addEventListener("touchstart", e=>{move = 1});
view.addEventListener("mousedown", e=>{move = 2});
view.addEventListener("touchstart", e=>{move = 2});
document.body.addEventListener("mouseup", e=>{
  if(move === 2){
    last = degdiff*0.8;
    degdiff = 0;
  }
  move = 0;
  wheelmove = null;
});
document.body.addEventListener("touchend", e=>{
  if(move === 2){
    last = degdiff;
    degdiff = 0;
  }
  move = 0;
  wheelmove = null;
});

wheelmove = null;
degdiff = 0;
document.body.addEventListener("mousemove", e=>{
  if(move===1){//1 is "slider"
    last = e.movementX / -1.5;
  }
  if(move===2){//2 is "wheel"
    last = 0;
    x1 = e.pageX - can.cx;
    y1 = e.pageY - can.cy;
    if(wheelmove === null){
      wheelmove = Math.atan2(y1,x1) / (Math.PI/180);//initial position
      return;
    }
    degdiff = (Math.atan2(y1,x1) / (Math.PI/180)) - wheelmove;
    wheelmove = (Math.atan2(y1,x1) / (Math.PI/180));
    modrot(degdiff);
  }
});

document.body.addEventListener("touchmove", e=>{
  if(move===1){//1 is "slider"
    last = e.touches[0].movementX / -1.5;
  }
  if(move===2){//2 is "wheel"
    last = 0;
    console.log(e);
    x1 = e.touches[0].pageX - can.cx;
    y1 = e.touches[0].pageY - can.cy;
    if(wheelmove === null){
      wheelmove = Math.atan2(y1,x1) / (Math.PI/180);//initial position
      return;
    }
    var degdiff = (Math.atan2(y1,x1) / (Math.PI/180)) - wheelmove;
    wheelmove = (Math.atan2(y1,x1) / (Math.PI/180));
    modrot(degdiff);
  }
});




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
percent = 100;
function renderWheel(rot, sizes, colors, balances, healths, center){
  //sizes       = radiuses[centerSize,             circleSize      ]
  //colors      =   base16[centerColor,      sectr1, sectr2, sectr3]
  //balances    =  degrees[                  break1, break2, break3]
  //healths     = percents[                  sectr1, sectr2, sectr3]

  //centerImage =         [centerPie, centerLoad, centerImage]
  [centerSize, circleSize] = sizes;
  if(circleSize < 0) circleSize = Math.min(can.w,can.h) / -circleSize;
  if(centerSize < 0) centerSize = circleSize / -centerSize;
  centerOutlineSize = centerSize*1.15;
  circleOutlineSize = circleSize*1.05;
  centerPieSize     = centerSize/1.2 
  balances = balances.map(balance=>(balance+rot));
  colors = colors.map(color=>(color[0]=="#")?(color):("#"+color))

  //render circleOutline
  renderArc("#FFFFFF", circleOutlineSize, 0, 360);

  //render circle
  renderSector(colors[1], circleSize, balances[2], balances[0]+120, healths[0]);
  renderSector(colors[2], circleSize, balances[0]+120, balances[1]+240, healths[1]);
  renderSector(colors[3], circleSize, balances[1]+240, balances[2], healths[2]);

  //render centerOutline
  var outline = 40;
  var x = (360*(outline/100))-90;            
  if(x !== 270) renderArc("#FFFFFF", centerOutlineSize, 270, x);
  else renderArc("#FFFFFF", centerOutlineSize, 0, 360);

  //render center
  renderArc(colors[0], centerSize, 0, 360);

  //render center pie
  pie = 20;
  x = (360*(pie/100))-90;            
  if(x !== 270) renderArc("#666666", centerPieSize, 270, x);
  else renderArc("#FFFFFF", centerOutlineSize, 0, 360);
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
    ctx.fillStyle = color;
    ctx.moveTo(can.cx, can.cy);
    ctx.arc(can.cx, can.cy, radius, angleFrom*deg, angleTo*deg);
  ctx.fill(); 
}
function renderSector(color, radius, angleFrom, angleTo, health){
  health /= 100; // convert health 0-100 (%) to health 0-1 (fractional)
  renderArc(darkColor(color), radius*health, angleFrom, angleTo) //dark
  renderArc(color, radius, angleFrom, angleTo) //light
}


function calcNextLast(x){
  /*if(x >= 32){
    return 0.5*x+16;
  }
  if(x < 32){
    return 4*((2*x)**0.5);
  }*/
/*  if(x > 2){
    return x - 1;
  }else{
    return (x**2) /4
  }*/
  /*if(Math.abs(x) > 1){
    return x - (Math.sign(x)*0.5);
  }else{
    if(x < 0) console.log(x)
    return (x**2) /2     //what the fuck? 
  }*/
  if(Math.abs(x) > 40){
    return Math.sign(x)*40;
  }
  if(Math.abs(x) > 0.125){
    return x - (Math.sign(x)*0.0625);
  }else{
    if(x < 0) console.log(x)
    return Math.sign(x) *4* (x**2)     //what the fuck? 
  }
}