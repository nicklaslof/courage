import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Entity from "./entity.js";
import Explosion from "./explosion.js";

class Bomb extends Entity{
    constructor(game,x,y,ttl,speed,directionX, directionY, shootingEntity, stopAtLocation){
        super(game,x,y,new Sprite(x,y,19,81,8,9,24,24,0xffffffff),1,{minX:0,minY:0,maxX:24,maxY:24});
        this.ttl = ttl;
        this.speed = speed;
        this.moveDirection = {x:directionX,y:directionY};
        this.shootingEntity = shootingEntity;
        this.stopVector = {x:0,y:0};
        this.stopAtLocation = stopAtLocation;
        this.stopBomb = false;
        this.explode = false;
        this.sprite.renderOffsetY=-24;
        this.sprite.renderOffsetX=-24;

        this.anim = new Animation();
        this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("e", this.sprite,160)
        .addState("e", new Sprite(x,y,0,32,1,1,1,1,0x00000000),240);
        
        this.anim.setCurrentState("i");
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.explode){
            this.disposed = true;
            return;
        }

        if (this.stopBomb) this.anim.setCurrentState("e");
        else this.anim.setCurrentState("i");
        
        if (this.light == null){
            this.light = game.screen.level.addLight(this.x,this.y,0xff0099ff,300,300,this.ttl,true);
            this.light.renderOffsetX = 7;
            this.light.renderOffsetY = 0;
        }

        if (this.ttl >0) this.ttl -= deltaTime;

        if (this.ttl <=0) this.explode = true;

        if (!this.stopBomb){
            this.stopVector.x = this.stopAtLocation.x - this.x;
            this.stopVector.y = this.stopAtLocation.y - this.y;
            let distance = game.length(this.stopVector);
            if (distance < 32) this.stopBomb = true;
            
            
        }else{
            this.moveDirection.x = this.moveDirection.y = 0;
        }

        if (this.explode){
            game.screen.level.addEntity(new Explosion(game,this.x,this.y,this.shootingEntity));
            game.playBombExplosion();
        }

        this.light.x = this.x;
        this.light.y = this.y;
    }

    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        //if (otherEntity instanceof Tile) this.stopBomb = true;
        return;
    }
}

export default Bomb;