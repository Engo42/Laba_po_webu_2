var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var u_press = false;
var d_press = false;
var l_press = false;
var r_press = false;
var shoot_press = false;
var popcat_spawn_timer = 60;
var pogodemon_spawn_timer = 600;
var rock_spawn_timer = 300;
var background_offset = 0;
var score = 0;
var best_score = 0;
var keyboard_confirm = false;
var mouse_confirm = false;
var touch_confirm = false;
var continue_confirm = false;
var touhou_mode = false;
var target_x = 0;
var target_y = 0;
var gameState = 0;
var Player;
var background = new Image();
background.src = 'sprites/sky.png';
var tutorial_screen = new Image();
tutorial_screen.src = 'sprites/tutorial_screen.png';
var music = new Audio('sound/music.mp3');

var EntityContainer = new Array;

function frameLoop() {
	switch(gameState){
		case 0:
			if (keyboard_confirm || mouse_confirm || touch_confirm){
				gameStart();
			}
			break;
		case 1:
			spawnEnemies();
			for (var i = 0; i < EntityContainer.length; i++) {
				if (EntityContainer[i].x < -400 || EntityContainer.y < -400
				|| EntityContainer[i].x > canvas.width + 400 || EntityContainer.y > canvas.height + 400
				|| EntityContainer[i].health <= 0){
					if (EntityContainer[i].isHittable == 1 && EntityContainer[i].health <= 0){
						score += 100;
					}
					if (EntityContainer[i].isHittable == -1){
						gameOver();
					}
					EntityContainer.splice(i, 1);
				}
				EntityContainer[i].frameAction();
			}
			break;
		case 2:
			if (continue_confirm){
				gameOpen();
			}
			break;
	}
	draw();
}
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	switch(gameState){
		case 0:
			ctx.drawImage(tutorial_screen, 0, 0);
			break;
		case 1:
			background_offset -= 16;
			if (background_offset == -4320)
				background_offset = 0;
			ctx.drawImage(background, background_offset, 0, 4320, 1080);
			ctx.drawImage(background, background_offset + 4320, 0, 4320, 1080);
			for (var i = 0; i < EntityContainer.length; i++) {
				EntityContainer[i].frameDraw();
			}
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(10, 10, 400, 10);
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(10, 10, 2*Player.health, 10);
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "28px Arial";
			ctx.fillText("Счёт: " + score.toString(), 10, canvas.height - 10);
			break;
		case 2:
			ctx.fillStyle = "#000000";
			ctx.font = "48px Arial";
			ctx.fillText("Игра окончена!", 20, 60);
			if (keyboard_confirm)
				ctx.fillText("Нажмите 'Z' на клавиатуре, вернуться на главный экран.", 20, 120);
			if (mouse_confirm)
				ctx.fillText("Нажмите левую кнопку мыши, чтобы вернуться на главный экран.", 20, 120);
			if (touch_confirm)
				ctx.fillText("Коснитесь экрана, чтобы вернуться на главный экран.", 20, 120);
			ctx.fillText("Ваш счет: " + score.toString(), 20, 180);
			ctx.fillText("Лучший счет: " + best_score.toString(), 20, 240);
			break;
	}
}
function spawnEnemies() {
	popcat_spawn_timer--;
	pogodemon_spawn_timer--;
	rock_spawn_timer--;
	if (popcat_spawn_timer == 0){
		popcat_spawn_timer = 120;
		EntityContainer.push(new popcat(canvas.width + 50, 80 + (canvas.height - 160) * Math.random()));
	}
	if (pogodemon_spawn_timer == 0){
		pogodemon_spawn_timer = 600;
		EntityContainer.push(new pogodemon(canvas.width - 303, 202 + (canvas.height - 404) * Math.random()));
	}
	if (rock_spawn_timer == 0){
		rock_spawn_timer = 600;
		EntityContainer.push(new rock(3 * Math.random()));
	}
}
function gameOpen(){
	gameState = 0;
	if (keyboard_confirm == false){
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
	}
	if (mouse_confirm == false){
		document.addEventListener("mousedown", mouseDownHandler, false);
		document.addEventListener("mouseup", mousUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);
	}
	if (touch_confirm == false){
		document.addEventListener("touchstart", touchMoveHandler, false);
		document.addEventListener("touchend", touchEndHandler, false);
		document.addEventListener("touchcancel", touchEndHandler, false);
		document.addEventListener("touchmove", touchMoveHandler, false);
	}
	keyboard_confirm = false;
	mouse_confirm = false;
	touch_confirm = false;
}
function gameStart(){	
	gameState = 1;
	popcat_spawn_timer = 60;
	pogodemon_spawn_timer = 600;
	rock_spawn_timer = 300;
	score = 0;
	if (keyboard_confirm == false){
		document.removeEventListener("keydown", keyDownHandler, false);
		document.removeEventListener("keyup", keyUpHandler, false);
	}
	if (mouse_confirm == false){
		document.removeEventListener("mousedown", mouseDownHandler, false);
		document.removeEventListener("mouseup", mousUpHandler, false);
		document.removeEventListener("mousemove", mouseMoveHandler, false);
	}
	if (touch_confirm == false){
		document.removeEventListener("touchstart", touchMoveHandler, false);
		document.removeEventListener("touchend", touchEndHandler, false);
		document.removeEventListener("touchstart", touchMoveHandler, false);
		document.removeEventListener("touchcancel", touchEndHandler, false);
	}
	Player = new player(100, 100, 20, 20);
	EntityContainer.push(Player);
	music.play();
}
function gameOver(){
	gameState = 2;
	if (best_score < score)
		best_score = score;
	EntityContainer.length = 0;
	continue_confirm = false;
	music.currentTime = 0;
	music.pause();
}
function checkCollision(a, b) {
	var x_dif = Math.abs(a.x - b.x);
	var y_dif = Math.abs(a.y - b.y);
	if (x_dif < a.width/2 + b.width/2 && y_dif < a.height/2 + b.height/2){
		return true;
	}
	return false;
}
setInterval(frameLoop, 100/6);
gameOpen();
music.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);