import Player from "../entity/player.js";
import Sprite from "../graphic/sprite.js";
import Tiles from "./tiles.js";

class Tile{

    constructor(texX,texY,texW,texH,c=0xffffffff,AABB={minX:0,minY:0,maxX:64,maxY:64}){
        this.sprite = new Sprite(0,0,texX,texY,texW,texH,16,16,c);
        this.sprite.sizeX = this.sprite.sizeY = 64;
        this.AABB = AABB;
        this.tempAABB = {minX:0,minY:0,maxX:0,maxY:0};
        this.c = c;
        return this;
    }

    render(game){
        this.sprite.tick(); // The sprite must be ticked once to make it visible to avoid ghost rendering of new unticked sprites with the wrong position.
        this.sprite.c = this.c;
        this.sprite.render(game);
    }

    doesCollideWithEntity(game,entity, tilePosX, tilePosY){
        if (entity.shootingEntity != null && this == Tiles.lava) return false;

        if (entity instanceof Player && this == Tiles.stairs && (game.screen.level.boss == null || game.screen.level.boss.health < 1) ) game.screen.tryChangeLevel(game, entity);

        if (entity instanceof Player && this == Tiles.stairs && game.screen.level.started && game.screen.level.boss != null && game.screen.level.boss.health > 0) game.setPlayerSays("I can't leave yet. "+game.screen.level.name+" is still alive!",3000);

        // Set our collision checking AABB to the size of the tilecollision and the position in world coordinates.
        
        this.tempAABB.minX = this.AABB.minX + tilePosX*64;
        this.tempAABB.maxX = this.AABB.maxX + tilePosX*64;
        this.tempAABB.minY = this.AABB.minY + tilePosY*64;
        this.tempAABB.maxY = this.AABB.maxY + tilePosY*64;

        // This is a classic AABB check that checks if the two collision boxes intersects with eachother.

        return (entity.tempAABB.minX <= this.tempAABB.maxX && entity.tempAABB.maxX >= this.tempAABB.minX)&&
        (entity.tempAABB.minY <= this.tempAABB.maxY && entity.tempAABB.maxY >= this.tempAABB.minY);


        // Debug code:

        /*console.log("tile position:");
        console.log(tilePosX+" "+tilePosY);
        console.log("tile:");
        console.log(this.tempAABB);
        console.log("entity:");
        console.log(entity.tempAABB);
        console.log("entity position:");
        console.log(entity.x + " "+entity.y);
        console.log("---------------------");
        let result = (entity.tempAABB.minX <= this.tempAABB.maxX && entity.tempAABB.maxX >= this.tempAABB.minX)&&
            (entity.tempAABB.minY <= this.tempAABB.maxY && entity.tempAABB.maxY >= this.tempAABB.minY);

        console.log(result);*

        return result;*/
    }

}

export default Tile;