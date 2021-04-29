function keyDownHandler(e) {
	if (typeof Player != "undefined") {
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
	}
    if(e.key == "z" || e.key == "Z" || e.key == "я" || e.key == "Я") {
		keyboard_confirm = true;
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
    if(e.key == "z" || e.key == "Z" || e.key == "я" || e.key == "Я") {
        shoot_press = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function mouseDownHandler(e) {
    mouse_confirm = true;
    shoot_press = true;
}
function mousUpHandler(e) {
    shoot_press = false;
}
function mouseMoveHandler(e) {
	var rect = canvas.getBoundingClientRect();
	var scaleX = canvas.width / rect.width;
	var scaleY = canvas.height / rect.height;
	target_x = e.offsetX*scaleX;
    target_y = e.offsetY*scaleY;
}
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mousUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function touchEndHandler(e) {
	e.preventDefault();
    shoot_press = false;
}
function touchMoveHandler(e) {
	e.preventDefault();
    touch_confirm = true;
    shoot_press = true;
	
	var rect = canvas.getBoundingClientRect();
	var scaleX = canvas.width / rect.width;
	var scaleY = canvas.height / rect.height;
	var touch = e.targetTouches[0];
	target_x = (touch.pageX - canvas.offsetLeft)*scaleX;
    target_y = (touch.pageY - canvas.offsetTop)*scaleY;
	ctx.fillText("Xmov " + touch.pageX, 5, canvas.height - 85);
	ctx.fillText("Ymov " + touch.pageY, 5, canvas.height - 65);
}
document.addEventListener("touchstart", touchMoveHandler, false);
document.addEventListener("touchend", touchEndHandler, false);
document.addEventListener("touchcancel", touchEndHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false);