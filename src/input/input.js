class Input {
    constructor() {
        this.keys = [];
        this.buttons = [];
        this.bombPressedPreviously = false;
        this.glideStillPressed = false;
        onkeydown = onkeyup = e => this.keys[e.keyCode] = e.type;
        onmousemove = e => { this.pointerX = e.movementX; this.pointerY = e.movementY; };
        onmousedown = onmouseup = e => this.buttons[e.button] = e.type;
        onclick = e => e.target.requestPointerLock();
        oncontextmenu = e => e.preventDefault();
    }

    tick() {
        this.axes = { x: (this.keys[68] == "keydown" || this.keys[39] == "keydown") - (this.keys[65] == "keydown" || this.keys[37] == "keydown"), y: (this.keys[83] == "keydown" || this.keys[40] == "keydown") - (this.keys[87] == "keydown" || this.keys[38] == "keydown") };
        this.pointer = { x: this.pointerX || 0, y: this.pointerY || 0 };
        this.firePressed = this.buttons[0] == "mousedown";
        this.glidePressed = (this.buttons[2] == "mousedown" || this.keys[32] == "keydown") && !this.glideStillPressed;
        if (this.buttons[2] == "mouseup" || this.keys[32] == "keyup") this.glideStillPressed = false;
        this.bombPressed = this.keys[69] == "keydown" && !this.bombPressedPreviously;
        this.bombPressedPreviously = this.keys[69] == "keydown";
        this.pointerX = 0;
        this.pointerY = 0;
        this.buttons[2] = this.keys[32] = null;
    }

    // getGlide but only if the player doesn't keep the glide button down all the time.
    getGlide(){
        return this.glidePressed ? (this.glideStillPressed = true) : false;
    } 
}

export default Input;