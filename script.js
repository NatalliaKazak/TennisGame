(function () {
  function ElObject (id, posx, posy, speedx, speedy, width, height, x, side, radius) {
  var canvas = document.getElementById(id);
  var Context =  canvas.getContext('2d');
  var self = this;
  self.scoreLeft = 0;
  self.scoreRight = 0;
  self.AreaH= {
    Width : 520,
    Height : 420
  }
  self.RandomDiap = function (N,M)    {
    var d = Math.floor(Math.random()*(M-N+1))+N;  
    if (d !== 0) {
      return d;
    }else {
      return d + 1;
    }
  }
  self.el = {
    PosX : posx,
    PosY : posy,
    SpeedY : speedy,
    SpeedX: speedx,
    Width : width,
    Height: height,
    Rarius : radius,
    Side: side,
    Update : function() { 
      if (x==='desk') {
       Context.fillStyle = 'green';
       Context.fillRect(this.PosX ,this.PosY, this.Width, this.Height);
      }
      if (x==='ball') {
       Context.fillStyle = 'red';
        Context.beginPath();
       Context.arc(this.PosX ,this.PosY, this.Width/2, 0, Math.PI*2, false);
       Context.fill();
      }
    }
  }
  }
  var deskR = new ElObject('movetennisfield',500 , 190, 0, 0, 10, 80, 'desk',1);
  var deskL = new ElObject('movetennisfield',10, 190, 0, 0, 10, 80,'desk',2);
  var BallH = new ElObject('movetennisfield',250, 190, 0, 0, 20, 20,'ball', 0, 10);
  var sqBrown = new ElObject('movetennisfield',250 , 250, 0, 0, 25, 25, 'desk', 'y');
  var sqGreen = new ElObject('movetennisfield',170, 300, 0, 0, 25, 25,'desk', 'y');
  var sqYellow = new ElObject('movetennisfield',150, 100, 0, 0, 25, 25,'desk', 'y');

  function createField () {
		var canvas = document.getElementById('tennisfield');
		var Context =  canvas.getContext('2d');
		Context.fillStyle = 'grey';
		Context.fillRect(0,0, canvas.width, canvas.height);    
    var canvas = document.getElementById('btn');
    var Context =  canvas.getContext('2d');
    Context.fillStyle = 'grey';
    Context.fillRect(0,0, 80.5, 40.5);
    Context.globalCompositeOperation = 'source-over';
    Context.font = 'normal 20px Arial';
    Context.fillStyle = 'black';
		Context.textAlign = 'center';
  	Context.strokeStyle = 'green';
    Context.fillText('Пуск!', 40, 25)
  }
  createField ();

  document.addEventListener('keydown', KeyDown, false);
  document.addEventListener('keyup', KeyUp, false);
  btn.addEventListener('click', Start, false);
  var RequestAnimationFrame=
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
  function(callback)
    { window.setTimeout(callback, 1000 / 60); };

  function MoveAll () {
    clear('movetennisfield');
    deskL.el.PosY += deskL.el.SpeedY;
    deskR.el.PosY += deskR.el.SpeedY;
    BallH.el.PosX += BallH.el.SpeedX;
    BallH.el.PosY += BallH.el.SpeedY;
    BordersBallTopBottom(BallH.el);
    BordersBallDesk(deskL.el);
    BordersBallDesk(deskR.el);
    deskL.el.Update();
    deskR.el.Update();
    sqYellow.el.Update();
    sqGreen.el.Update();
    sqBrown.el.Update();
    BordersBallRightLeft(BallH.el);
    var array = [deskL.el, sqGreen.el,deskR.el, sqYellow.el, sqBrown.el ]
    for (var i = 0; i<array.length; i++) {
      var colBR = collisionSQ (BallH.el, array[i]);
      if (colBR.collision && BallH.el.SpeedX !==0 && BallH.el.SpeedY !==0) {
        collideDecisionSQ(colBR, BallH.el)
      }
    }
    BallH.el.Update();
    var timer = RequestAnimationFrame(MoveAll);
    UpdateScore();
  };
 MoveAll ();
     
  function Start() {
    if (BallH.el.SpeedY === 0 ) {
      BallH.el.PosX = 240;
  		BallH.el.PosY = 190;
  		BallH.el.SpeedX = 3* BallH.RandomDiap(-1,1);
  		BallH.el.SpeedY = 3* BallH.RandomDiap(-1,1);
  	}
  }

  function UpdateScore() {
    clear('score');
    canvas = document.getElementById('score');
    var Context =  canvas.getContext('2d');
    Context.globalCompositeOperation = 'source-over';
    Context.font = 'normal 25.5px Arial';
    Context.fillStyle = 'black';
  	Context.textAlign = 'center';
  	Context.strokeStyle = 'green';
    Context.fillText(BallH.scoreLeft +' : '+ BallH.scoreRight, 40, 25);
    if(BallH.scoreLeft===5|| BallH.scoreRight === 5){
        BallH.scoreLeft = 0;
        BallH.scoreRight = 0;
        return false;
    }
  }
  UpdateScore();

  function collisionSQ(ball, desk){
    var dx = 0, dy = 0;
		var half = { x: desk.Width/2,
		             y: desk.Height/2 };
    var center = { x: ball.PosX - (desk.PosX+half.x), 
                   y: ball.PosY - (desk.PosY+half.y)};
    var side = { x: Math.abs(center.x) - half.x, 
                 y: Math.abs(center.y) - half.y};
    if ((side.x > ball.Rarius || side.y > ball.Rarius) || (side.x < -ball.Rarius && side.y < -ball.Rarius) ){ 
      return { collision: false }; 
    }
   	if (side.x < 0 || side.y < 0) {
			if (Math.abs(side.x) < ball.Rarius && side.y < 0) {
			  if (center.x*side.x < 0 ) {
			    dx = -1;
			  } else {
			    dx = 1;
			  }
  		} else if (Math.abs(side.y) < ball.Rarius && side.x < 0){
  		  if (center.y*side.y < 0 ) {
			    dy = -1;
			  } else {
			    dy = 1;
			  }
  		}
      return { collision: true, x:dx, y:dy };
		}
    collision = side.x*side.x + side.y*side.y < ball.Rarius * ball.Rarius;
		if (!collision) return { collision:false }
		if (center.x < 0  ) {
			    dx = -1;
			  } else {
			    dx = 1;
			  }
    if (center.y < 0  ) {
			    dy = -1;
			  } else {
			    dy = 1;
			  }
		var n = Math.sqrt(side.x*side.x+side.y*side.y);
		return { collision:true, x: dx*side.x/n, y: dy*side.y/n };
  }
  function collideDecisionSQ(col, ball) {
    var len =col.x * ball.SpeedX + col.y * ball.SpeedY;
		var normal = { x: col.x * len, y: col.y * len };
  	ball.SpeedX = ball.SpeedX -2*normal.x;
  	ball.SpeedY = ball.SpeedY-2*normal.y ;
  }
  function DesksKeyDown (keyCode,keyCodeTop,keyCodeBottom, speed, desk) {
    if (keyCode == keyCodeTop) {
      desk.SpeedY = -speed;
    } if (keyCode == keyCodeBottom) {
      desk.SpeedY = speed;
    }
  }
  function DesksKeyUp (keyCode,keyCodeTop,keyCodeBottom, speed, desk) {
    if (keyCode == keyCodeTop) {
      desk.SpeedY = speed;
    }
    if (keyCode == keyCodeBottom) {
      desk.SpeedY = speed;
    }
  }
  function KeyUp (EO){
    EO = EO || window.event;
    EO.preventDefault();
    var keyCode = EO.keyCode;
    DesksKeyUp(keyCode, 16, 17, 0, deskL.el);
    DesksKeyUp(keyCode, 38, 40, 0, deskR.el);
  }
  function KeyDown (EO){
    EO = EO || window.event;
    EO.preventDefault();
    var keyCode = EO.keyCode;
    DesksKeyDown(keyCode, 16, 17, 5, deskL.el);
    DesksKeyDown(keyCode, 38, 40, 5, deskR.el);
  }

  function BordersBallDesk (desk) {
    if ( desk.PosY+ desk.Height> deskL.AreaH.Height-10 ) {
      desk.PosY= deskL.AreaH.Height - desk.Height-10 ;
    }
    if ( desk.PosY  < 10 ) {
      desk.PosY=10;
    } 
  }
  function BordersBallTopBottom(ball) {
    if ( ball.PosY+ ball.Height > BallH.AreaH.Height ) {
         ball.SpeedY=-ball.SpeedY;
      ball.PosY= BallH.AreaH.Height - ball.Height;
    }
    if ( ball.PosY<ball.Width ) {
      ball.SpeedY=-ball.SpeedY;
      ball.PosY=ball.Width;
    } 
  }
  function BordersBallRightLeft(Ball) {
    if ( Ball.PosX+Ball.Width > BallH.AreaH.Width ) {
      Ball.SpeedX=0;
      Ball.SpeedY=0;
      Ball.PosX=BallH.AreaH.Width - Ball.Width;
      BallH.scoreRight++;
    }
    if ( BallH.el.PosX<BallH.el.Width) {
      Ball.PosX=BallH.el.Width;
      Ball.SpeedX=0;
      Ball.SpeedY=0;
      BallH.scoreLeft++;
    }
  }
  function MouseOver() {
    btn.style.cursor ='pointer';
  }
  MouseOver();
  
  function clear(id) {
  	var canvas = document.getElementById(id);
  	var Context =  canvas.getContext('2d');
  	Context.clearRect(0, 0, Context.canvas.width, Context.canvas.height);
  }
})();