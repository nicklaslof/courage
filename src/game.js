import Texture from "./graphic/texture.js";
import Screen from "./screen/screen.js";
import { TinySprite } from './lib/tinysprite.js';

class Game{

    constructor(){
        this.canvas = document.getElementById("g");

        this.WIDTH=W;
        this.HEIGHT=H;

        this.gl = TinySprite(this.canvas);
        this.gl.flush();

        this.image = new Image();
        this.texture = new Texture(this.gl.g);
        this.image.src = "t.png";

        this.fps = this.fpsCounter = this.deltaTime = 0;
        this.lastTime = performance.now();

        this.screen = new Screen(this.WIDTH, this.HEIGHT);

    }

    update(){
        if (this.texture.glTexture.dirty) return;

        let currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.gl.bkg(0,0,0,1);
        this.gl.cls();

        this.screen.tick(deltaTime);
        this.screen.render(this);

        this.gl.flush();

        this.fpsCounter += deltaTime;
        this.fps++;

        if (this.fpsCounter > 1000){
            console.log("FPS: "+this.fps);
            this.fpsCounter = this.fps = 0;
        }


    }

}

export default Game;