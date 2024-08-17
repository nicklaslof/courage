import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bullet from "./bullet.js";

import Entity from "./entity.js";

class Player extends Entity{
    constructor(x,y,pixelScale){
        super(x,y,new Sprite(x,y,0,112,16,16,pixelScale,pixelScale,0xffffffff),10,{minX:16,minY:10,maxX:48,maxY:58});
        this.speed = 176;
        this.pixelScale = pixelScale;
        this.canShoot = true;
        this.fireDelay = 0;
        this.aimX = this.aimY = 0;
        this.health = 80;
        this.hitDelay = 240;
        

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("walk", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
       
        this.animation.setCurrentState("idle");

        this.aimSprite = new Sprite(this.x,this.y,0,71,7,7,24,24,0xffffffff);

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

        this.aimX += game.input.pointer.x;
        this.aimY += game.input.pointer.y;

        if (this.aimX > 200) this.aimX = 200;
        if (this.aimX < -200) this.aimX = -200;
        if (this.aimY > 200) this.aimY = 200;
        if (this.aimY < -200) this.aimY = -200;


        this.aimSprite.x = game.cameraCenterX+this.aimX;
        this.aimSprite.y = game.cameraCenterY+this.aimY;
        this.aimSprite.tick();

        if (this.fireDelay > 0){
            this.fireDelay -= deltaTime;
        }

        if (this.fireDelay <= 0 && !this.canShoot) this.canShoot = true;

        if (game.input.firePressed && this.canShoot){
            let aim = {x:this.aimX ,y:this.aimY};
            this.normalize(aim);

            game.screen.level.addEntity(new Bullet(this.x+24,this.y+32,400,720,aim.x, aim.y,this));
            this.canShoot = false;
            this.fireDelay = 128;
            game.playShoot();
        }
       //console.log(this.x/64+" "+this.y/64);

    }

    render(game){
        super.render(game);
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Bullet && otherEntity.shootingEntity == this) return;
        this.hit(game,1);
    }

    renderUI(game){
        this.aimSprite.render(game);
    }

    onHit(game){
        //if (entity instanceof Bullet && entity.shootingEntity == this) return;
        game.playPlayerHit();
    }
}
export default Player;