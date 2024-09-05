// Handles the player input. Either from a gamepad or the keyboard
class Input{

    constructor() {
        this.bombPressedPreviously = this.glideStillPressed = false;
        this.pointerX = this.pointerY = 0;
    }

    handleTouchStart(event) {
        let e0 = event.touches[0];
        let e1 = event.touches[1];
        this.touchStartX = e0.clientX;
        this.touchStartY = e0.clientY;
        this.touchStartX2 = e1?e1.clientX:null;
        this.touchStartY2 = e1?e1.clientY:null;
        this.touchPressed = true;

    }

    handleTouchMove(event) {
        let e0 = event.touches[0];
        let e1 = event.touches[1];
        this.axes.x = -(this.touchStartX - e0.clientX);
        this.axes.y = -(this.touchStartY - e0.clientY);
        this.pointerX = e1?-(this.touchStartX2 - e1.clientX)*3:null;
        this.pointerY = e1?-(this.touchStartY2 - e1.clientY)*3:null;
        this.touchStartX2 = e1?e1.clientX:null;
        this.touchStartY2 = e1?e1.clientY:null;
        this.touchDetected = true;
    }

    handleTouchEnd() {
        this.touchDetected = false;
    }

    tick(game){
        // reset all inputs and read them on each tick
        this.axes = this.touchDetected ? this.axes:{x:0,y:0};
        this.pointer = {x:0,y:0};
        this.firePressed = this.bombPressed = this.glidePressed = false;
        if (this.touchPressed){
            this.firePressed = true;
            //this.touchPressed = false;
        }
        if (game.keys[68] == "keydown") this.axes.x = 1;
        if (game.keys[65] == "keydown") this.axes.x = -1;
        if (game.keys[83] == "keydown") this.axes.y = 1;
        if (game.keys[87] == "keydown") this.axes.y = -1;
        if (game.buttons[0] == "mousedown") this.firePressed = true;
        if (game.buttons[2] == "mousedown" || game.keys[32] == "keydown"){
            this.glidePressed = true;
        }
        if (game.buttons[2] == "mouseup" || game.keys[32] == "keyup"){
            this.glideStillPressed = false;
        }
        if (game.keys[69] == "keydown" && !this.bombPressedPreviously) this.bombPressed = true;

        this.bombPressedPreviously = game.keys[69] == "keydown";

        this.pointer.x = this.pointerX;
        this.pointer.y = this.pointerY;
        this.pointerX = this.pointerY = 0;
    }
    getGlide(){
        if (this.glideStillPressed) return false;
        return this.glidePressed ? (this.glideStillPressed = true) : false;
    }
}

export default Input;