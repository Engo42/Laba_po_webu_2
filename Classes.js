class entity {
	constructor(x, y, width, height){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.speed_x = 0;
		this.speed_y = 0;
		this.isHittable = 0;
		this.health = 1;
	}
	frameAction(){}
	frameDraw(){}
	killed(){}
	getDamage(damage){
		this.health -= damage;
	}
}

class player extends entity {
	constructor(x, y){
		super(x, y, 40, 40);
		this.health = 200;
		this.max_speed = 15;
		this.speed = this.max_speed;
		this.reload = 5;
		this.overdrive = 0;
		this.img = new Image();
		this.img.src = 'sprites/player.png';
		this.isHittable = -1;
		this.invTimer = 0;
	}
	frameAction(){
		if (keyboard_confirm){
			target_x = this.x;
			target_y = this.y;
			if(l_press)
				target_x -= 100;
			if(r_press)
				target_x += 100;
			if(u_press)
				target_y -= 100;
			if(d_press)
				target_y += 100;
		}
		if (touhou_mode) 
			this.speed = this.max_speed/1.5;
		else 
			this.speed = this.max_speed;
		if (target_x < 40) target_x = 40;
		if (target_x > canvas.width - 40) target_x = canvas.width - 40;
		if (target_y < 40) target_y = 40;
		if (target_y > canvas.height - 40) target_y = canvas.height - 40;
		if (this.speed >= Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2))){
			this.x = target_x;
			this.y = target_y;
		}
		else {
			this.x += this.speed * (target_x-this.x) / Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2));
			this.y += this.speed * (target_y-this.y) / Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2));
		}
		if(this.reload > 0)
			this.reload--;
		if(this.invTimer > 0)
			this.invTimer--;
		if(shoot_press && this.reload == 0){
			EntityContainer.push(new playerBullet(this.x + 80, this.y));
			this.reload = 5;
		}			
	}
	frameDraw(){
		if (Math.floor(this.invTimer/10)%2 == 1)
			ctx.globalAlpha = 0.5;
		ctx.drawImage(this.img, this.x - 160, this.y - 160);
		ctx.globalAlpha = 1;
	}
	getDamage(damage){
		super.getDamage(damage);
		this.invTimer = 60;
	}
}

class popcat extends entity {
	constructor(x, y){
		super(x, y, 160, 160);
		this.health = 160;
		this.reload = 69;
		this.y_dir = 1;
		this.isHittable = 1;
		this.award = 100;
		this.img_idle = new Image();
		this.img_idle.src = 'sprites/popcat_idle.png';
		this.img_shoot = new Image();
		this.img_shoot.src = 'sprites/popcat_pop.png';
		this.pop_sound = new Audio('sound/pop_sound.mp3');
	}
	frameAction(){
		this.x -= 2;
		this.y += this.y_dir * 2;
		if (this.y <= 80 || this.y >= canvas.height - 80)
			this.y_dir = -this.y_dir;
		this.reload--;
		if (this.reload == 0){
			EntityContainer.push(new popcatBullet(this.x, this.y));
			this.reload = 69;
			this.pop_sound.play();
		}
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i]) && EntityContainer[i].invTimer == 0){
				EntityContainer[i].getDamage(10);
			}
		}
	}
	frameDraw(){
		if (this.reload > 40)
			ctx.drawImage(this.img_shoot, this.x - this.width/2, this.y - this.height/2);
		else
			ctx.drawImage(this.img_idle, this.x - this.width/2, this.y - this.height/2);
	}
}

class pogodemon extends entity {
	constructor(x, y){
		super(x, y, 404, 404);
		this.health = 404;
		this.reload = 111;
		this.x_dir = 1;
		this.y_dir = 1;
		this.isHittable = 1;
		this.award = 400;
		this.img_idle = new Image();
		this.img_idle.src = 'sprites/pogodemon_idle.png';
		this.img_shoot = new Image();
		this.img_shoot.src = 'sprites/pogodemon_pog.png';
		this.pog_sound = new Audio('sound/pog_sound.mp3');
	}
	frameAction(){
		this.x += this.x_dir;
		this.y += this.y_dir * 4;
		if (this.y <= 202 || this.y >= canvas.height - 202)
			this.y_dir = -this.y_dir;
		if (this.x <= canvas.width - 606 || this.x >= canvas.width - 202)
			this.x_dir = -this.x_dir;
		this.reload--;
		if (this.reload == 0){
			for (var i = -2; i <= 2; i++){
				EntityContainer.push(new pogodemonBullet(this.x - 60, this.y, -16*(Math.cos(i*Math.PI/12)), 16*(Math.sin(i*Math.PI/12))));
			}
			this.reload = 111;
			this.pog_sound.play();
		}
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i]) && EntityContainer[i].invTimer == 0){
				EntityContainer[i].getDamage(25);
			}
		}
	}
	frameDraw(){
		if (this.reload > 80)
			ctx.drawImage(this.img_shoot, this.x - this.width/2, this.y - this.height/2);
		else
			ctx.drawImage(this.img_idle, this.x - this.width/2, this.y - this.height/2);
	}
}

class playerBullet extends entity {
	constructor(x, y){
		super(x, y, 3, 3);
		this.img = new Image();
		this.img.src = 'sprites/player_bullet.png';
	}
	frameAction(){
		this.x += 35;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == 1 && checkCollision(this, EntityContainer[i])){
				EntityContainer[i].health -= 10;
				this.health = 0;
			}
		}
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - 30, this.y - 6);
	}
}

class popcatBullet extends entity {
	constructor(x, y){
		super(x, y, 40, 40);
		this.img = new Image();
		this.img.src = 'sprites/popcat_bullet.png';
	}
	frameAction(){
		this.x -= 8;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i]) && EntityContainer[i].invTimer == 0){
				EntityContainer[i].getDamage(10);
				this.health = 0;
			}
		}
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - this.width, this.y - this.height);
	}
}

class pogodemonBullet extends entity {
	constructor(x, y, x_dir, y_dir){
		super(x, y, 40, 40);
		this.x_dir = x_dir;
		this.y_dir = y_dir;
		this.img = new Image();
		this.img.src = 'sprites/pogodemon_fireball.png';
	}
	frameAction(){
		this.x += this.x_dir;
		this.y += this.y_dir;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i]) && EntityContainer[i].invTimer == 0){
				EntityContainer[i].getDamage(25);
				this.health = 0;
			}
		}
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - this.width, this.y - this.height);
	}
}

class rock extends entity {
	constructor(pos){
		if (pos < 1)
			pos = -1;
		if (pos >= 1 && pos < 2)
			pos = 0;
		if (pos >= 2)
			pos = 1;
		super(canvas.width + 300, 540 - pos * 370, 100, 340);
		this.x_dir = -8;
		this.img = new Image();
		if (pos == -1)
			this.img.src = 'sprites/rock_bottom.png';
		if (pos == 0)
			this.img.src = 'sprites/rock_middle.png';
		if (pos == 1)
			this.img.src = 'sprites/rock_top.png';
	}
	frameAction(){
		this.x += this.x_dir;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i]) && EntityContainer[i].invTimer == 0){
				EntityContainer[i].getDamage(10);
			}
		}
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - this.width/2, this.y - this.height/2);
	}
}