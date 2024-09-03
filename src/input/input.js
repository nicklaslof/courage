// Handles the player input. Either from a gamepad or the keyboard
class Input{

    constructor() {
        this.bombPressedPreviously = this.glideStillPressed = false;
        this.pointerX = this.pointerY = 0;
    }

    tick(game){
        // reset all inputs and read them on each tick
        this.axes = {x:0,y:0};
        this.pointer = {x:0,y:0};
        this.firePressed = this.bombPressed = this.glidePressed = false;
        
        if (game.keys[68] == "keydown") this.axes.x = 1;
        if (game.keys[65] == "keydown") this.axes.x = -1;
        if (game.keys[83] == "keydown") this.axes.y = 1;
        if (game.keys[87] == "keydown") this.axes.y = -1;
        if (game.buttons[0] == "mousedown") this.firePressed = true;
        if (game.buttons[2] == "mousedown"){
            this.glidePressed = true;
        }
        if (game.buttons[2] == "mouseup"){
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