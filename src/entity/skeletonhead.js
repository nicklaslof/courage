import Sprite from "../graphic/sprite.js";
import Tile from "../tile/tile.js";
import Tiles from "../tile/tiles.js";
import Entity from "./entity.js";
import Pickup from "./pickup.js";
import Player from "./player.js";

class SkeletonHead extends Entity{
    constructor(x,y,sizeX,sizeY){
        super(x,y,new Sprite(x,y,20,64,6,7,sizeX,sizeY,0xffffffff),1,{minX:0,minY:0,maxX:16,maxY:16});
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Player){
            console.log(otherEntity);
            this.moveDirection.x = otherEntity.moveDirection.x;
            this.moveDirection.y = otherEntity.moveDirection.y;
            this.speed = 500;
        }
        if (otherEntity instanceof Tile && otherEntity != Tiles.floor1){
            this.health = 0;
        }
    }

    tick(game,deltaTime){
        let deltaSeconds = deltaTime / 1000;
        let speedReduction = 0.8;
        let decay = Math.pow(1 - speedReduction, deltaSeconds);
        this.speed *= decay;
        if (this.speed > 40) game.screen.level.addParticle(this.x,this.y+this.pixelScale,0x99dddddd,game.getRandom(1,10),game.getRandom(1,10),500,{x:game.getRandom(-1,1),y:game.getRandom(-1,1)},game.getRandom(20,50));
        super.tick(game,deltaTime);
    }
    onDeath(game){
        for (let i = 0; i < 32;i++){
            game.screen.level.addParticle(this.x,this.y+this.pixelScale,0xffdddddd,game.getRandom(1,12),game.getRandom(1,12),1500,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},game.getRandom(50,120));
        }
        if (Math.random() < 0.1) game.screen.level.addEntity(new Pickup(this.x,this.y,game.getRandom(-1,1),"b"));
    }
}
export default SkeletonHead;