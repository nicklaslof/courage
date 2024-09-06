import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";
import Player from "./player.js";

class Pickup extends Entity{
    //Type:
    // c = courage
    // b = bomb
    constructor(game,x,y,moveX,type="c"){
        super(game,x,y,type == "c"?new Sprite(x,y,128,38,32,32,32,32,0xff0000ff):new Sprite(x,y,19,81,8,9,24,24,0xffffffff),10,{minX:0,minY:0,maxX:20,maxY:20});
        this.moveDirection.x = moveX;
        this.type = type;

        this.landY = y+0.01;
        this.counter=0;
        this.speed = 150;
        this.normalizeMove = false;
        this.moveToPlayerRange = 192;
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
            this.speed = game.screen.level.player.playerSpeed+5;
        }

        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff3333ff,64,64,10000,false);
        this.light.renderOffsetX = 12;
        this.light.renderOffsetY = 6;
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);
        this.updateAABB();
       
    }

    hit(game,ammount){
        return;
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Player){
            if (this.type == "c") otherEntity.health++;
            if (this.type == "b") otherEntity.bombPickup(game);
            game.screen.level.removeEntity(this);
            game.screen.level.removeLight(this.light);
            game.playCouragePickup(); return }
    }
}

export default Pickup;