// Handles the player input. Either from a gamepad or the keyboard
class Input{

    constructor() {
        this.usePressedPreviously = false;
        this.pointerX = 0;
        this.pointerY = 0;
    }

    tick(game){
        // reset all inputs and read them on each tick
        this.axes = {x:0,y:0};
        this.pointer = {x:0,y:0};
        this.firePressed = false;
        this.usePressed = false;
        this.hasGamepad = false;
        
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        var gp = gamepads[0];

        if (gp != null){
            this.hasGamepad = true;
            
            if (gp.axes[0] >0.4) this.axes.x = gp.axes[0];
            if (gp.axes[0] <-0.4) this.axes.x = gp.axes[0];
            if (gp.axes[1] >0.4) this.axes.y = gp.axes[1];
            if (gp.axes[1] <-0.4) this.axes.y = gp.axes[1];
            if (gp.axes[2] >0.4) this.pointer.x = gp.axes[2]*3;
            if (gp.axes[2] <-0.4) this.pointer.x = gp.axes[2]*3;
            if (gp.axes[3] >0.4) this.pointer.y = gp.axes[3]*3;
            if (gp.axes[3] <-0.4) this.pointer.y = gp.axes[3]*3;
            if (gp.buttons[7].pressed) this.firePressed = true;
            // usePressedPreviously is to stop the usekey to spam a new click when holding it down
            if (gp.buttons[3].pressed && !this.usePressedPreviously) this.usePressed = true;
            this.usePressedPreviously = gp.buttons[3].pressed;
        }else{
            if (game.keys[68] == "keydown") this.axes.x = 1;
            if (game.keys[65] == "keydown") this.axes.x = -1;
            if (game.keys[83] == "keydown") this.axes.y = 1;
            if (game.keys[87] == "keydown") this.axes.y = -1;
            if (game.buttons[0] == "mousedown") this.firePressed = true;
            //if (game.keys[32] == "keydown") this.firePressed = true;
            // usePressedPreviously is to stop the usekey to spam a new click when holding it down
            if (game.keys[69] == "keydown" && !this.usePressedPreviously) this.usePressed = true;
            this.usePressedPreviously = game.keys[69] == "keydown";

            this.pointer.x = this.pointerX;
            this.pointer.y = this.pointerY;
            this.pointerX = this.pointerY = 0;
        }
    }
}

export default Input;