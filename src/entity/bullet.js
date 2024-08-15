import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Bullet extends Entity{
    constructor(x,y,ttl,speed,directionX, directionY, shootingEntity){
        super(x,y,new Sprite(x,y,0,64,6,6,16,16,0xffffffff),1,{minX:0,minY:0,maxX:6,maxY:6});
        this.sprite.renderOffsetX = -24;
        this.sprite.renderOffsetY = -24;
        this.ttl = ttl;
        this.speed = speed;
        this.moveDirection = {x:directionX,y:directionY};
        this.shootingEntity = shootingEntity;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.ttl -= deltaTime;
        if (this.ttl <= 0) this.disposed = true;
    }

    onCollision(otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        this.disposed = true;
        otherEntity.hit(1);
    }
}

export default Bullet;