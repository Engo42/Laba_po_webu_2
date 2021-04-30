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
		super(x, y, 80, 80);
		this.health = 200;
		this.energy = 100;
		this.reload = 5;
		this.overdrive = 0;
		this.img = new Image();
		this.img.src = 'sprites/Sprie.jpg';
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
		if (target_x < 40) target_x = 40;
		if (target_x > canvas.width - 40) target_x = canvas.width - 40;
		if (target_y < 40) target_y = 40;
		if (target_y > canvas.height - 40) target_y = canvas.height - 40;
		if (10 >= Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2))){
			this.x = target_x;
			this.y = target_y;
		}
		else {
			this.x += 10 * (target_x-this.x) / Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2));
			this.y += 10 * (target_y-this.y) / Math.sqrt(Math.pow(target_x-this.x, 2) + Math.pow(target_y-this.y, 2));
		}
		if(this.reload > 0)
			this.reload--;
		if(this.invTimer > 0)
			this.invTimer--;
		if(shoot_press && this.reload == 0){
			EntityContainer.push(new playerBullet(this.x, this.y));
			this.reload = 5;
		}			
	}
	frameDraw(){
		if (Math.floor(this.invTimer/10)%2 == 1)
			ctx.globalAlpha = 0.5;
		ctx.drawImage(this.img, this.x - this.width/2, this.y - this.height/2);
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
		this.reload = 70;
		this.y_dir = 1;
		this.isHittable = 1;
		this.img_idle = new Image();
		this.img_idle.src = 'sprites/popcat_idle.png';
		this.img_shoot = new Image();
		this.img_shoot.src = 'sprites/popcat_pop.png';
		this.pop_sound = new Audio('sound/pop_sound.mp3');
	}
	frameAction(){
		this.x -= 2;
		this.y += this.y_dir * 2;
		if (this.y <= 20 || this.y >= canvas.height - 20)
			this.y_dir = -this.y_dir;
		this.reload--;
		if (this.reload == 0){
			EntityContainer.push(new popcatBullet(this.x, this.y));
			this.reload = 69;
			this.pop_sound.play();
		}
	}
	frameDraw(){
		if (this.reload > 40)
			ctx.drawImage(this.img_shoot, this.x - this.width/2, this.y - this.height/2);
		else
			ctx.drawImage(this.img_idle, this.x - this.width/2, this.y - this.height/2);
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
		this.x += 15;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == 1 && checkCollision(this, EntityContainer[i])){
				EntityContainer[i].health -= 10;
				this.health = 0;
			}
		}
	}
	frameDraw(){
		ctx.beginPath();
		ctx.fillStyle = "#9500DD";
		ctx.arc(this.x, this.y, this.width, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
}

class popcatBullet extends entity {
	constructor(x, y){
		super(x, y, 80, 80);
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
		ctx.drawImage(this.img, this.x - this.width/2, this.y - this.height/2);
	}
}