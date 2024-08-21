import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";
import Player from "./player.js";

class Courage extends Entity{
    constructor(x,y,moveX){
        super(x,y,new Sprite(x,y,128,38,32,32,32,32,0xff0000ff),10,{minX:24,minY:24,maxX:48,maxY:48});
        this.moveDirection.x = moveX;
        this.landY = y+0.01;
        this.counter=0;
        this.speed = 150;
        this.normalizeMove = false;
        this.moveToPlayerRange = 96;

    }

    tick(game,deltaTime){
        
        super.tick(game,deltaTime);
        
        this.counter +=deltaTime;
        let s = -Math.sin(this.counter/50);
        this.moveDirection.y = s*4;

        if (this.y >= this.landY || this.counter > 336){
            this.moveDirection.x = 0;
            this.moveDirection.y = 0;
            this.moveAgainstPlayer(game);
            this.speed = game.screen.level.player.speed+5;
        }

        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff0000ff,64,64,10000,false);
        this.light.renderOffsetX = 6;
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);
    }

    hit(game,ammount){
        return;
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Player){ otherEntity.health++; game.screen.level.removeEntity(this); game.screen.level.removeLight(this.light); game.playCouragePickup(); return }
    }
}

export default Courage;