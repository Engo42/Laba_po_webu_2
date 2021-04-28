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
    if(e.key == "z" || e.key == "Z" || e.key == "я" || e.key == "Я") {
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