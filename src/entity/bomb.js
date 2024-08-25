import Sprite from "../graphic/sprite.js";
import Tile from "../tile/tile.js";
import Entity from "./entity.js";
import Explosion from "./explosion.js";

class Bomb extends Entity{
    constructor(x,y,ttl,speed,directionX, directionY, shootingEntity, stopAtLocation){
        super(x,y,new Sprite(x,y,19,81,8,9,16,16,0xffffffff),1,{minX:0,minY:-8,maxX:0,maxY:8});
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
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.explode){
            this.disposed = true;
            return;
        }
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
            if (distance < 64) this.stopBomb = true;
        }else{
            this.moveDirection.x = this.moveDirection.y = 0;
        }

        if (this.explode){
            game.screen.level.addEntity(new Explosion(this.x,this.y,this.shootingEntity));
            game.playBombExplosion();
        }

        this.light.x = this.x;
        this.light.y = this.y;
    }

    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        if (otherEntity instanceof Tile) this.stopBomb = true;
    }
}

export default Bomb;