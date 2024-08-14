import Texture from "./graphic/texture.js";
import Screen from "./screen/screen.js";

class Game{

    constructor(){
        this.canvas = document.getElementById("g");
        this.context = this.canvas.getContext("2d");

        this.WIDTH=this.canvas.width;
        this.HEIGHT=this.canvas.height;

        this.texture = new Texture("t.png");


        this.fps = this.fpsCounter = this.deltaTime = 0;
        this.lastTime = performance.now();

        this.screen = new Screen(this.WIDTH, this.HEIGHT, this.texture);

    }

    update(){
        let currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.screen.tick(deltaTime);
        this.screen.render(this.context);
        this.fpsCounter += deltaTime;
        
        this.fps++;


        if (this.fpsCounter > 1000){
            console.log("FPS: "+this.fps);
            this.fpsCounter = this.fps = 0;
        }


    }

}

export default Game;