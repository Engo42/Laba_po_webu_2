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

var EntityContainer = new Array;

function frameLoop() {
	spawnEnemies();
	for (var i = 0; i < EntityContainer.length; i++) {
		if (EntityContainer[i].x < -100 || EntityContainer.y < -100
		|| EntityContainer[i].x > canvas.width + 100 || EntityContainer.y > canvas.height + 100
		|| EntityContainer[i].health <= 0){
			if (EntityContainer[i].isHittable == 1){
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
	draw();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < EntityContainer.length; i++) {
		EntityContainer[i].frameDraw();
	}
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(5, 5, 200, 5);
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(5, 5, Player.health, 5);
	ctx.fillStyle = "#000000";
	ctx.font = "12px Arial";
	ctx.fillText("Score: " + score.toString(), 5, canvas.height - 5);
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
				EntityContainer.push(new enemy(canvas.width + 50, 20 + (canvas.height - 40) * Math.random()));
				enemy_count++;
				enemies_left--;
			}
			break;
	}
}
function MainMenu(){
	
}
function gameStart(){
	
}
function gameOver(){
	
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
var Player = new player(100, 100);
EntityContainer.push(Player);
nextWave();