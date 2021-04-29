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
}

class player extends entity {
	constructor(x, y){
		super(x, y, 80, 80);
		this.health = 200;
		this.energy = 100;
		this.reload = 5;
		this.overdrive = 0;
		this.img = new Image();
		this.img.src = 'Sprie.jpg';
		this.isHittable = -1;
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
		if(shoot_press && this.reload == 0){
			EntityContainer.push(new playerBullet(this.x, this.y));
			EntityContainer.push(new playerBullet(this.x, this.y));
			this.reload = 5;
		}			
	}
	frameDraw(){
		ctx.drawImage(this.img, this.x - this.width/2, this.y - this.height/2);
	}
}

class enemy extends entity {
	constructor(x, y){
		super(x, y, 20, 20);
		this.health = 100;
		this.reload = 70;
		this.y_dir = 1;
		this.isHittable = 1;
	}
	frameAction(){
		this.x -= 1;
		this.y += this.y_dir;
		if (this.y <= 20 || this.y >= canvas.height - 20)
			this.y_dir = -this.y_dir;
		this.reload--;
		if (this.reload == 0){
			EntityContainer.push(new enemyBullet(this.x, this.y));
			this.reload = 70;
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

class enemyBullet extends entity {
	constructor(x, y){
		super(x, y, 10, 10);
	}
	frameAction(){
		this.x -= 4;
		for (var i = 0; i < EntityContainer.length; i++) {
			if (EntityContainer[i].isHittable == -1 && checkCollision(this, EntityContainer[i])){
				EntityContainer[i].health -= 10;
				this.health = 0;
			}
		}
	}
	frameDraw(){
		ctx.beginPath();
		ctx.fillStyle = "#950000";
		ctx.arc(this.x, this.y, this.width, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
}