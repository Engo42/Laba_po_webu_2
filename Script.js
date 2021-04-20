var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var bx = canvas.width/2;
var by = canvas.height-30;
var u_press = false;
var d_press = false;
var l_press = false;
var r_press = false;
var shoot_press = false;
var ball_rad = 10;

class entity {
	constructor(x, y, width, height){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}
	frameAction(){}
}

class player extends entity {
	constructor(x, y){
		super(x, y, 80, 80);
		this.health = 2000;
		this.energy = 100;
		this.reload = 5;
		this.overdrive = 0;
		this.img = new Image();
		this.img.src = 'Sprie.jpg';
	}
	frameAction(){
		if(l_press && this.x - 5 >= this.width/2)
			this.x -= 5;
		if(r_press && this.x + 5 <= canvas.width - this.width/2)
			this.x += 5;
		if(u_press && this.y - 5 >= this.height/2)
			this.y -= 5;
		if(d_press && this.y + 5 <= canvas.height - this.height/2)
			this.y += 5;
		if(shoot_press && this.reload == 0){
			EntityContainer.push(new playerBullet(this.x, this.y));
			this.reload = 5;
		}			
		if(this.reload > 0)
			this.reload--;
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - this.width/2, this.y - this.height/2);
	}
}

class enemy extends entity {
	constructor(x, y){
		super(x, y, 40, 40);
		this.health = 100;
		this.reload = 60;
	}
	frameAction(){
		this.x -= 1;
		if (this.x < -this.width){
			this.clear;
		}
		this.reload -= 1;
		if (this.reload = 0){
			this.reload = 60;
		}
	}
}

class obstacle extends entity {
	constructor(x, y){
		super(x, y, 40, 40);
	}
	frameAction(){
		this.x -= 1;
	}
}

class playerBullet extends entity {
	constructor(x, y){
		super(x, y, 3, 3);
	}
	frameAction(){
		this.x += 10;
	}
	frameDraw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width, 0, Math.PI*2);
		ctx.fillStyle = "#9500DD";
		ctx.fill();
		ctx.closePath();
	}
}

class enemyBullet extends entity {
	constructor(x, y){
		super(x, y, 20, 20);
	}
	frameAction(){
		this.x -= 4;
	}
}

var EntityContainer = new Array;

function frameLoop() {
	for (var i = 0; i < EntityContainer.length; i++) {
		EntityContainer[i].frameAction();
	}
	draw();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < EntityContainer.length; i++) {
		EntityContainer[i].frameDraw();
	}
}

function keyDownHandler(e) {
    if(e.key == "ArrowRight") {
        r_press = true;
    }
    if(e.key == "ArrowLeft") {
        l_press = true;
    }
    if(e.key == "ArrowUp") {
        u_press = true;
    }
    if(e.key == "ArrowDown") {
        d_press = true;
    }
    if(e.key == "z") {
        shoot_press = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "ArrowRight") {
        r_press = false;
    }
    if(e.key == "ArrowLeft") {
        l_press = false;
    }
    if(e.key == "ArrowUp") {
        u_press = false;
    }
    if(e.key == "ArrowDown") {
        d_press = false;
    }
    if(e.key == "z") {
        shoot_press = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(frameLoop, 100/6);
var Player = new player(100, 100);
EntityContainer.push(Player);