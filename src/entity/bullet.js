import Sprite from "../graphic/sprite.js";

import Courage from "./courage.js";
import Entity from "./entity.js";
import Player from "./player.js";
import Spider from "./spider.js";
import Tile from "../tile/tile.js";

class Bullet extends Entity{
    constructor(x,y,ttl,speed,directionX, directionY, shootingEntity,c=0xff0000ff,stopAtLocation=null){
        super(x,y,new Sprite(x,y,0,64,6,6,16,16,c),1,{minX:-6,minY:-6,maxX:6,maxY:6});
        this.sprite.renderOffsetX = -24;
        this.sprite.renderOffsetY = -24;
        this.ttl = ttl;
        this.speed = speed;
        this.moveDirection = {x:directionX,y:directionY};
        this.shootingEntity = shootingEntity;
        this.light = null;
        this.stopAtLocation = stopAtLocation;
        this.stopMovement = false;
    }

    tick(game,deltaTime){
        if (this.light == null){
            this.light = game.screen.level.addLight(this.x,this.y,this.sprite.c,96,96,this.ttl);
            this.light.renderOffsetX = -20;
            this.light.renderOffsetY = -24;
        }
        super.tick(game,deltaTime);
        this.light.x = this.x;
        this.light.y = this.y;
        this.ttl -= deltaTime;
        if (this.ttl <= 0)this.disposed = true;

        if (this.stopAtLocation != null){
            this.calculatePlayerDirectionVector.x = this.stopAtLocation.x - this.x;
            this.calculatePlayerDirectionVector.y = this.stopAtLocation.y - this.y;
            if (game.length(this.calculatePlayerDirectionVector) < 32){
                this.stopMovement = true;
                console.log(this.stopMovement);
            }

        }

        if (this.stopMovement) this.moveDirection.x = this.moveDirection.y = 0;
    }

    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        if (!(this.shootingEntity instanceof Player) && otherEntity instanceof Spider) return;
        if (otherEntity instanceof Courage) return;
        if (otherEntity instanceof Bullet) return;
        this.disposed = true;
        if(this.light != null) this.light.disposed = true;
        if (otherEntity instanceof Tile) return;
        otherEntity.hit(game,1);
    }
}

export default Bullet;