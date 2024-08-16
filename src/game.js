import Texture from "./graphic/texture.js";
import Screen from "./screen/screen.js";
import { TinySprite } from './lib/tinysprite.js';
import GlTexture from "./graphic/gltexture.js";
import Input from "./input/input.js";
import {zzfx} from './lib/z.js'

class Game{

    constructor(){
        this.canvas = document.getElementById("g");
        this.canvas.width = W;
        this.canvas.height = H;

        this.gl = TinySprite(this.canvas);
        this.gl.flush();

        this.image = new Image();
        this.texture = new Texture(this.gl.g);
        this.image.src = "t.png";

        this.keys =[];
        this.buttons = [];
        onkeydown=onkeyup=e=> this.keys[e.keyCode] = e.type;
        this.input = new Input();
        onclick=e=> this.canvas.requestPointerLock();
        onmousemove=e=>{this.input.pointerX = e.movementX;this.input.pointerY = e.movementY};
        onmousedown=onmouseup=e=> this.buttons[e.button] = e.type;

        this.setupLightBuffer();

        this.fps = this.fpsCounter = this.deltaTime = 0;
        this.lastTime = performance.now();

        this.screen = new Screen(W, H);

        this.cameraCenterX = W/2;
        this.cameraCenterY = H/2;

    }

    setupLightBuffer(){
        this.lightTexture = new GlTexture(this.gl.g,null).tex;
        this.effectTexture = new GlTexture(this.gl.g, null).tex;
        this.fb = this.setupFrameBuffer(this.gl.g,this.lightTexture);   
    }

    setupFrameBuffer(gl,texture){
        var fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);   
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return fb;
    }

    update(){
        if (this.texture.glTexture.dirty) return;

        let currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.input.tick(this);
        this.screen.tick(this,deltaTime);

        this.gl.bkg(0,0,0,1);
        this.gl.cls();

        // Set blend mode and render the level
        this.gl.g.blendFunc(this.gl.g.SRC_ALPHA,this.gl.g.ONE_MINUS_SRC_ALPHA);
        this.screen.render(this);
        this.gl.flush();

        // Bind the light buffer
        this.gl.g.bindFramebuffer(this.gl.g.FRAMEBUFFER, this.fb);

        // Set the global darkness
        this.gl.bkg(0.2,0.2,0.2,1.0);
        this.gl.cls();
        this.gl.flip = false;
        this.gl.col = 0xffffffff;
        this.gl.g.enable( this.gl.g.BLEND );
        this.gl.g.blendFunc(this.gl.g.SRC_ALPHA, this.gl.g.ONE);
        this.screen.renderLight(this);
        this.gl.flush();
        this.gl.g.bindFramebuffer(this.gl.g.FRAMEBUFFER, null);
        
        this.gl.col = 0xffffffff;
        this.gl.g.blendFunc(this.gl.g.DST_COLOR, this.gl.g.ZERO);
        this.gl.img(this.lightTexture,0,0,W,H,0,0,0,1,1,0,1,1,0);

        this.gl.flush();
        this.gl.g.blendFunc(this.gl.g.SRC_ALPHA,this.gl.g.ONE_MINUS_SRC_ALPHA);
        this.screen.renderUI(this);
        this.gl.flush();

        this.fpsCounter += deltaTime;
        this.fps++;

        if (this.fpsCounter > 1000){
            console.log("FPS: "+this.fps);
            this.fpsCounter = this.fps = 0;
        }
    }

    // Generate a random number between min and max;
    getRandom(min, max){
        return Math.random() * (max - min) + min
    }

    playShoot(){
        //zzfx(...[1.06,,194,.03,.05,.04,1,1.81,3.5,.2,,,.06,,,,,.72,.03,.05]);
        zzfx(...[1.2,2,242,.02,.02,.001,,1.4,-80,,,,,,3.6,.1,.18,.87,.03,,-1374]);
    }

    playEnemyKilled(){
        //zzfx(...[,,98,.06,.03,.53,2,.6,-8,-5,,,,1.7,,.8,,.31,.11,.29,163]);
        //zzfx(...[1.5,,377,.01,,.26,,2.1,-1,-1,,,.04,.6,44,,.13,.45,.09,.49,210]);
        zzfx(...[.5,5,351,.01,.08,.29,1,3.5,5,-17,,,,1.8,,.3,,.91,.07]);
    }

    playEnemyHit(){
        //zzfx(...[2.8,,215,.01,.03,.04,3,2.4,,,,,,.9,,.3,,.46,.06,,-2330]);
        //zzfx(...[.8,,104,.01,.08,.16,,3.7,,-1,,,,.7,,.2,,.5,.03,,728]);
        //zzfx(...[.9,,284,,.03,.19,4,.6,-3,-1,,,,,,.2,,.73,.02,.4,-2298]);
        //zzfx(...[.5,,179,.01,.04,.03,1,3.5,5,-17,,,,1.8,,.3,,.91,.03]);
        zzfx(...[1.3,.5,298,.01,.03,.09,3,1.3,,,,,,.7,,.4,,.96,,.49,-2451]);
    }

    playPlayerHit(){
        zzfx(...[1.2,,693,.02,.04,.05,1,4.5,,-98,-2,.55,,,2.9,.3,,.87,.01,.45]);
    }

}

export default Game;