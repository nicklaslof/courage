import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Bullet extends Entity{
    constructor(x,y,ttl,speed,directionX, directionY, shootingEntity){
        super(x,y,new Sprite(x,y,0,64,6,6,16,16,0xff00ffff),1,{minX:-6,minY:-6,maxX:6,maxY:6});
        this.sprite.renderOffsetX = -24;
        this.sprite.renderOffsetY = -24;
        this.ttl = ttl;
        this.speed = speed;
        this.moveDirection = {x:directionX,y:directionY};
        this.shootingEntity = shootingEntity;
        this.light = null;
    }

    tick(game,deltaTime){
        if (this.light == null){
            this.light = game.screen.level.addLight(this.x,this.y,0xff007777,64,64,this.ttl);
            this.light.renderOffsetX = -20;
            this.light.renderOffsetY = -24;
        }
        super.tick(game,deltaTime);
        this.light.x = this.x;
        this.light.y = this.y;
        this.ttl -= deltaTime;
        if (this.ttl <= 0)this.disposed = true;
    }

    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        this.disposed = true;
        this.light.disposed = true;
        otherEntity.hit(game,1);
    }
}

export default Bullet;