import Texture from "./graphic/texture.js";
import Screen from "./screen/screen.js";
import { TinySprite } from './lib/tinysprite.js';
import GlTexture from "./graphic/gltexture.js";
import Input from "./input/input.js";
import {zzfx} from './lib/z.js'
import Tiles from "./tile/tiles.js";
import UI from "./ui/ui.js";
import IntroScreen from "./screen/introscreen.js";

class Game{

    
    constructor(){
        this.canvas = document.getElementById("g");
        this.canvas.width = W;
        this.canvas.height = H;

        this.ui = new UI();

        this.gl = TinySprite(this.canvas);
        this.gl.flush();

        this.image = new Image();
        this.texture = new Texture(this.gl.g);
        this.image.src = "t.png";
   
        this.input = new Input();

        this.setupLightBuffer();

        //this.fps = this.fpsCounter = this.deltaTime = 0;
        this.lastTime = performance.now();

        this.switchToIntro();

        this.cameraCenterX = W/2;
        this.cameraCenterY = H/2;

        this.clearPlayerTextCountdown = 0;

        this.gameRules = [
            {mobHealthExtra:0,explosionRange:500,spawnRate:0.6,courageDrops:2,courageDropChance:1,bombDropChance:1,bossBulletSpeed:0.5},
            {mobHealthExtra:0,explosionRange:400,spawnRate:1,courageDrops:1,courageDropChance:1,bombDropChance:1,bossBulletSpeed:1},
            {mobHealthExtra:1,explosionRange:200,spawnRate:3,courageDrops:1,courageDropChance:0.5,bombDropChance:2,bossBulletSpeed:3}
        ];
    

    }

    getGamerule(){
        return this.gameRules[this.diffulty];
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
        if ((this.gameFinished || this.gameOver) && !(this.screen instanceof IntroScreen)) {
            this.screen = this.gameOver ? new IntroScreen(this,() => this.switchToGame()): new IntroScreen(this,()=>this.switchToIntro());
            if (this.gameOver) this.playGameOver(); else this.playGameFinished();
            this.setupLightBuffer();
        }
        let currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        deltaTime = Math.min(32,deltaTime);

        this.input.tick();

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
        let d = this.screen.getGlobalDarkness();
        this.gl.bkg(d.r,d.g,d.b,d.a);
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

        if (this.clearPlayerTextCountdown >0 ) this.clearPlayerTextCountdown -= deltaTime;
        else this.playerSays = null;

        this.ui.render(this);

        //this.fpsCounter += deltaTime;
        //this.fps++;

        //if (this.fpsCounter > 1000){
       //     console.log("FPS: "+this.fps);
       //     this.fpsCounter = this.fps = 0;
       // }
    }

    setPlayerSays(text,clear){
        this.playerSays = text;
        this.clearPlayerTextCountdown = clear;
    }

    switchToGame(){
        this.showIntro = false;
        this.showDiffcultySelection = false;
        this.gameOver = false;
        this.screen = new Screen(this,W, H);
        this.setupLightBuffer();
    }

    switchToEndScreen(){
        this.gameFinished = true;
    }

    switchToIntro(){
        this.diffulty = -1;
        this.showIntro = true;
        this.gameFinished = this.gameOver = false;
        this.screen = new IntroScreen(this);
    }

    switchToGameOver(){
        this.gameOver = true;
    }

    isLevelTransition(){
        return (this.screen.isLevelTransition());
    }

    // Generate a random number between min and max;
    getRandom(min, max){
        return Math.random() * (max - min) + min
    }

    // Raycast between two positions. If there is anything blocking the view the entity can't see the other entity
    // I had to include the upper wall here since we are actually walking inside it.
    canEntitySee(level,x1,y1,x2,y2){
        let points = this.getPointsBetween(Math.round(x1/64),Math.round(y1/64),Math.round(x2/64),Math.round(y2/64));
        for (let i = 0; i < points.length;i++){
            let p = points[i];
            let tile = level.getTile(p.x,p.y);
            if (tile != Tiles.floor1 && tile != Tiles.wall1) return false;

        }
        return true;
    }

    // Bresinheims line algorithm to get all x and y coordinates in a straight line between two points. Useful for simple raycasting
    getPointsBetween(x1, y1, x2, y2) {
        let points = [], dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1, err = dx - dy;
    
        while (true) {
            points.push({x: x1, y: y1});
            if (x1 === x2 && y1 === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) err -= dy, x1 += sx;
            if (e2 < dx) err += dx, y1 += sy;
        }
        return points;
    }

    length(v){
        return Math.hypot(v.x, v.y);
    }

    playShoot(){
        zzfx(...[.8,2,242,.02,.02,.001,,1.4,-80,,,,,,3.6,.1,.18,.87,.03,,-1374]);
    }

   

    playEnemyHit(){
        zzfx(...[1.3,.5,298,.01,.03,.09,3,1.3,,,,,,.7,,.4,,.96,,.49,-2451]);
    }

    playPlayerHit(){
        zzfx(...[1.2,,693,.02,.04,.05,1,4.5,,-98,-2,.55,,,2.9,.3,,.87,.01,.45]);
    }

    playEnemyKilled(){
        zzfx(...[,.95,58,.02,.02,.05,,.3,,13,24,.05,,.7,1.2,,,.4,.02,.01,-1354]);
    }

    playBoxHit(){
        zzfx(...[2.9,,357,.02,.06,.05,3,.2,1,,,,,.4,,.3,.08,.5,.05,,-2369]);
    }

    playBoxExplosion(){
        zzfx(...[,0,62,.03,.15,.03,4,1.5,3,,,,.09,.5,,.4,.15,.32,.28,.39]);
    }

    playCouragePickup(){
        zzfx(...[.2,,680,,,,1,1.5,-7,19,490,.07,,.3,,,,.93,.05,,-621]);
    }

    playFullCourage(){
        zzfx(...[.4,,446,.01,.14,.46,,1.1,1,15,419,.08,.02,.1,,.2,.17,.95,.19,.12]);
    }

    playBombExplosion(){
        zzfx(...[.8,,79,,.17,.65,4,1.6,8,-1,,,,.8,,.3,,.31,.22,.07,-2865]);
    }

    playGlide(){
        zzfx(...[.1,,319,.03,.01,.001,4,1.8,,,,.26,,.3,,,.11,.86,.3,.01]);
    }

    playPlayerRunning(){
        zzfx(...[.3,,475,,.01,.02,4,2.3,,,,,,,,,,.86,,.12,-540]);
    }

    playBossHit(){
        zzfx(...[1.6,,416,.01,.02,,4,.6,-3,,,,.03,2,,.1,.19,.85,.09,.44,-2458]);
    }
    
    playGameOver(){
        zzfx(...[0.5,,210,.02,.27,1.18,,2.6,-7,-172,-99,.05,.02,,,.2,,.84,.24,.37,104]);
    }

    playGameFinished(){
        zzfx(...[0.5,,547,.09,.17,1.74,1,4,,-6,,,.05,,1.3,.1,,.83,.2,.07]);
    }
}

export default Game;