import Sprite from "../graphic/sprite.js";

import Pickup from "./pickup.js";
import Entity from "./entity.js";
import Player from "./player.js";
import Spider from "./spider.js";
import Tile from "../tile/tile.js";
import Clown from "./clown.js";
import Fire from "./fire.js";
import Alien from "./alien.js";
import Bomb from "./bomb.js";
import Explosion from "./explosion.js";
import Thirteen from "./thirteen.js";

class Bullet extends Entity{
    constructor(game,x,y,ttl,speed,directionX, directionY, shootingEntity,c=0xffffffff,stopAtLocation=null,flickering=false,customSprite=null,collisionBox={minX:-4,minY:-4,maxX:16,maxY:16},damage=1){
        super(game,x,y,customSprite == null ? new Sprite(x,y,0,64,6,6,16,16,c) : customSprite,1,collisionBox);
        this.ttl = ttl;
        this.speed = speed;
        this.moveDirection = {x:directionX,y:directionY};
        this.shootingEntity = shootingEntity;
        this.light = null;
        this.stopAtLocation = stopAtLocation;
        this.stopMovement = false;
        this.flickering = flickering;
        this.damage = damage;
        this.shadow = new Sprite(0,0,0,64,6,6,this.sprite.sizeX,this.sprite.sizeY,0x77000000);

    }

    tick(game,deltaTime){
        if (this.light == null){
            this.light = game.screen.level.addLight(this.x,this.y,this.sprite.c,96,96,this.ttl,this.flickering);
            this.light.renderOffsetX = 20;
            this.light.renderOffsetY = 16;
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
            }

        }

        if (this.stopMovement) this.moveDirection.x = this.moveDirection.y = 0;

        this.horizontalFlip = true;
        this.shadow.x = this.sprite.x;
        this.shadow.y = this.sprite.y+24;
        this.shadow.tick();
    }

    onCollision(game,otherEntity){
        if (otherEntity == null || otherEntity == this.shootingEntity) return;
        if (!(this.shootingEntity instanceof Player) && (otherEntity instanceof Spider || otherEntity instanceof Clown || otherEntity instanceof Fire || otherEntity instanceof Alien || otherEntity instanceof Thirteen)) return;
        if (otherEntity instanceof Pickup || otherEntity instanceof Bullet || otherEntity instanceof Bomb || otherEntity instanceof Explosion) return;
        if (!otherEntity.damageImmune) this.disposed = true;
        if(this.light != null) this.light.disposed = true;
        if (otherEntity instanceof Tile) return;
        //if (this.stopAtLocation != null && !this.stopMovement) return;
        if (!otherEntity.damageImmune) otherEntity.hit(game,this.damage);
    }

    render(game){
        super.render(game);
        !this.stopMovement && this.shadow.render(game);
    }
}

export default Bullet;