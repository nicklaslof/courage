import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bullet from "./bullet.js";

import Entity from "./entity.js";

class Player extends Entity{
    constructor(x,y,pixelScale){
        super(x,y,new Sprite(x,y,0,112,16,16,pixelScale,pixelScale,0xffffffff),10,{minX:16,minY:10,maxX:48,maxY:58});
        this.speed = 128;
        this.pixelScale = pixelScale;
        this.canShoot = true;
        this.fireDelay = 0;
        

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("walk", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
       
        this.animation.setCurrentState("idle");

    }

    tick(game,deltaTime){
        this.moveDirection.x = game.input.axes.x;
        this.moveDirection.y = game.input.axes.y;

        if (this.moveDirection.x != 0 || this.moveDirection.y != 0) this.animation.setCurrentState("walk");
        else this.animation.setCurrentState("idle");
        super.tick(game,deltaTime);

        // Overwrite player position set in the parent class tick function because player should always be rendered at center of the screen
        this.sprite.x = game.cameraCenterX;
        this.sprite.y = game.cameraCenterY;

        if (this.fireDelay > 0){
            this.fireDelay -= deltaTime;
        }

        if (this.fireDelay <= 0 && !this.canShoot) this.canShoot = true;

        if (game.input.firePressed && this.canShoot){
            game.screen.level.addEntity(new Bullet(this.x+24,this.y+32,400,800,this.facingDirection.x, this.facingDirection.y,this));
            this.canShoot = false;
            this.fireDelay = 360;
        }
    }

    render(game){
        super.render(game);
    }

    onCollision(entity){
        //entity.disposed = true;
    }
}
export default Player;