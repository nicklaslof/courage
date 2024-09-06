import Sprite from "../graphic/sprite.js";
import Box from "./box.js";
import Enemy from "./enemy.js";
import Entity from "./entity.js";
import SkeletonHead from "./skeletonhead.js";

class Explosion extends Entity{
    constructor(game,x,y,shootingEntity){
        super(game,x,y,new Sprite(x,y,0,32,1,1,1,1,0x00000000),1,{minX:-game.getGamerule().explosionRange/2,minY:-game.getGamerule().explosionRange/2,maxX:game.getGamerule().explosionRange/2,maxY:game.getGamerule().explosionRange/2});
        this.shootingEntity = shootingEntity;
        this.ttl = 64;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        for (let i = 0; i<20;i++){
            game.screen.level.addLight(this.x+game.getRandom(-200,200),this.y+game.getRandom(-200,200),0xff0077ff,200,200,game.getRandom(128,512),true);
        }
        
        this.ttl -= deltaTime;
        if (this.ttl <= 0) this.disposed = true;
    }


    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        if (otherEntity instanceof Enemy || otherEntity instanceof Box|| otherEntity instanceof SkeletonHead){
            otherEntity.hit(game,2);
        }
    }
}

export default Explosion;