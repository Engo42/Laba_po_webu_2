var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var u_press = false;
var d_press = false;
var l_press = false;
var r_press = false;
var shoot_press = false;
var enemy_spawn_timer = 60;
var wave = 0;
var enemy_count = 0;
var enemies_left = 0;
var score = 0;
var best_score = 0;
var keyboard_confirm = false;
var mouse_confirm = false;
var touch_confirm = false;
var continue_confirm = false;
var target_x = 0;
var target_y = 0;
var gameState = 0;
var Player;

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
				if (EntityContainer[i].x < -100 || EntityContainer.y < -100
				|| EntityContainer[i].x > canvas.width + 100 || EntityContainer.y > canvas.height + 100
				|| EntityContainer[i].health <= 0){
					if (EntityContainer[i].isHittable == 1 && EntityContainer[i].health <= 0){
						enemy_count--;
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
			ctx.fillStyle = "#000000";
			ctx.font = "24px Arial";
			ctx.fillText("Нажмите 'Z' на клавиатуре, чтобы начать игру в режиме клавиатуры.", 5, canvas.height - 45);
			ctx.fillText("Нажмите левую кнопку мыши, чтобы начать игру в режиме мыши.", 5, canvas.height - 25);
			ctx.fillText("Коснитесь экрана, чтобы начать игру в режиме касания.", 5, canvas.height - 5);
			break;
		case 1:
			for (var i = 0; i < EntityContainer.length; i++) {
				EntityContainer[i].frameDraw();
			}
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(10, 10, 400, 10);
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(10, 10, 2*Player.health, 10);
			ctx.fillStyle = "#000000";
			ctx.font = "24px Arial";
			ctx.fillText("Score: " + score.toString(), 5, canvas.height - 5);
			ctx.fillText("X " + target_x.toString(), 5, canvas.height - 45);
			ctx.fillText("Y " + target_y.toString(), 5, canvas.height - 25);
			break;
		case 2:
			ctx.fillStyle = "#000000";
			ctx.font = "24px Arial";
			ctx.fillText("Игра окончена!", 5, canvas.height - 65);
			if (keyboard_confirm)
				ctx.fillText("Нажмите 'Z' на клавиатуре, вернуться на главный экран.", 5, canvas.height - 45);
			if (mouse_confirm)
				ctx.fillText("Нажмите левую кнопку мыши, чтобы вернуться на главный экран.", 5, canvas.height - 45);
			if (touch_confirm)
				ctx.fillText("Коснитесь экрана, чтобы вернуться на главный экран.", 5, canvas.height - 45);
			ctx.fillText("Ваш счет: " + score.toString(), 5, canvas.height - 25);
			ctx.fillText("Лучший счет: " + best_score.toString(), 5, canvas.height - 5);
			break;
	}
}
function nextWave() {
	wave++;
	switch(wave){
		case 1:
			enemies_left = 10;
			break;
	}
}
function spawnEnemies() {
	if (enemies_left == 0 && enemy_count == 0)
		nextWave();
	
	enemy_spawn_timer--;
	switch(wave){
		case 1:
			if (enemy_spawn_timer == 0 && enemies_left > 0){
				enemy_spawn_timer = 180;
				EntityContainer.push(new popcat(canvas.width + 50, 20 + (canvas.height - 40) * Math.random()));
				enemy_count++;
				enemies_left--;
			}
			break;
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
	enemy_spawn_timer = 60;
	wave = 0;
	enemy_count = 0;
	enemies_left = 0;
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
	nextWave();
}
function gameOver(){
	gameState = 2;
	if (best_score < score)
		best_score = score;
	EntityContainer.length = 0;
	continue_confirm = false;
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