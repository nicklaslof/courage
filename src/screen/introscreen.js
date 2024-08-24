import Animation from "../entity/animation.js";
import Sprite from "../graphic/sprite.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";

class IntroScreen{

    constructor(){
        this.floor = Tiles.floor1.sprite;
        this.u0 = 128/TZ;
        this.u1 = 200/TZ;
        this.v0 = this.u0 + (550/TZ);
        this.v1 = this.u1 + (550/TZ);

        this.lightRenderX = (W/2)+20;
        this.lightRenderY = H/2;
        this.lightRenderOffsetX = 0;
        this.lightRenderOffsetY = 0;

        this.sizeX = 256+64;
        this.sizeY = 256;

        let x = W/2;
        let y = H/2;

        this.pixelScale = 72;
        this.sprite = new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff);
        this.animation = new Animation();
        this.animation.addState("walk", this.sprite,160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("walk", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
        
        this.animation.setCurrentState("walk");
    }

    tick(game, deltaTime){
        this.floor.tick(game,deltaTime);

        this.animation.tick(game,deltaTime);
        this.sprite = this.animation.currentSprite;
        this.sprite.x = W/2;
        this.sprite.y = H/2;

        this.sprite.tick();
        if (game.input.firePressed) game.switchToGame();
    }

    render(game){
        for (let x = 32; x < W; x+=64){
            for (let y = 32; y < H+32; y+=64){
                this.floor.x = x;
                this.floor.y = y;
                this.floor.render(game);
            }
        }

        this.sprite.render(game);


    }

    getGlobalDarkness(){
        return {r:0.3,g:0.3,b:0.5,a:1.0};
    }

    renderLight(game){
        game.gl.col = 0xff55ffff;
        game.gl.img(game.texture.glTexture.tex,(-this.sizeX/2)+this.lightRenderOffsetX,(-this.sizeY/2)+this.lightRenderOffsetY,this.sizeX,this.sizeY,0,this.lightRenderX,this.lightRenderY,1,1, this.u0, this.u1, this.v0, this.v1);
    }

    renderUI(game){
        
    }

}

export default IntroScreen;