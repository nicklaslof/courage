import Animation from "../entity/animation.js";
import Sprite from "../graphic/sprite.js";
import Tiles from "../tile/tiles.js";

class IntroScreen{

    constructor(game,clickAction){
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
        this.clickDelay = 500;

        //this.clickAction = clickAction?clickAction:()=>game.switchToGame();
        this.clickAction = clickAction?clickAction:()=>{game.showDiffcultySelection=true;game.showIntro=false};

        this.pixelScale = 72;
        this.sprite = new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff);
        this.anim = new Animation();
        this.anim.addState("w", this.sprite,160)
        .addState("w", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("w", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("w", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
        
        this.anim.setCurrentState("w");
    }

    tick(game, deltaTime){
        if (this.clickDelay > 0) this.clickDelay -= deltaTime;
        this.floor.tick(game,deltaTime);
        this.anim.tick(game,deltaTime);
        this.sprite = this.anim.currentSprite;
        this.sprite.x = (W/2)-36;
        this.sprite.y = (H/2)-32;

        this.sprite.tick();

        if (this.clickAction && this.clickDelay <= 0 && game.input.firePressed) this.clickAction();
        if (game.showDiffcultySelection){
            let k = game.input.keys;
            if (k[49] == "keydown") game.diffulty = 0;
            if (k[50] == "keydown") game.diffulty = 1;
            if (k[51] == "keydown") game.diffulty = 2;
            
            if (game.diffulty>-1)game.switchToGame();
        }
    }

    render(game){
        for (let x = 0; x < W; x+=64){
            for (let y = 0; y < H+32; y+=64){
                this.floor.x = x;
                this.floor.y = y;
                this.floor.render(game);
            }
        }

        this.sprite.render(game);


    }

    isLevelTransition(){
        return false;
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