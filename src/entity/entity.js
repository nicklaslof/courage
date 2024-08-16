import Tiles from "../tile/tiles.js";
import Bullet from "./bullet.js";

class Entity{

    constructor(x,y,sprite,health=1,collisionBox={minX:0,minY:0,maxX:64,maxY:64}){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.horizontalFlip = false;
        this.moveDirection = {x:0,y:0};
        this.facingDirection = {x:0,y:0};
        this.speed = 1;
        this.animation = null;
        this.collisionBox = collisionBox;
        this.AABB = {minX:0,minY:0,maxX:0,maxY:0};
        this.tempAABB = {minX:0,minY:0,maxX:0,maxY:0};
        this.tempVector = {x:0, y:0};
        this.pixelScale = 16;
        this.disposed = false;
        this.health = health;
        this.hitDelay = 120;
        this.hitDelayCounter = this.hitDelay ;

        this.updateAABB();
    }

    tick(game,deltaTime){

        if (this.health <= 0){
            this.onDeath(game);
            this.disposed = true;
        }

        if (this.hitDelayCounter > 0){
            this.hitDelayCounter -= deltaTime;
        }
        
        if (this.disposed){
            return;
        }

        if (this.animation != null){
            this.animation.tick(game,deltaTime);
            this.sprite = this.animation.currentSprite;
        }

        if (this.moveDirection.x != 0 || this.moveDirection.y != 0){
            //Normalize the moveDirection so the entity doesn't walk faster when walking in both x and y axis.
            this.normalize(this.moveDirection);
            
            this.tempVector.x = this.x + this.moveDirection.x * this.speed * deltaTime/1000;
            this.tempVector.y = this.y + this.moveDirection.y * this.speed * deltaTime/1000;
            
            
            // Check against the environment (tiles) if we can move. Do the check on X and Y coordinates in two seperate calls.
            // If we check both in the same call that will make us stuck in a wall instead of sliding against it.
            let moveX = this.canMove(game,this.tempVector.x,this.y);
            let moveY = this.canMove(game,this.x,this.tempVector.y);

            // Move in each direction if we was allowed.
            if (moveX) this.x += this.tempVector.x - this.x;
            if (moveY) this.y += this.tempVector.y - this.y;
    
    
            if (this.moveDirection.x < 0) this.horizontalFlip = false;
            if (this.moveDirection.x > 0) this.horizontalFlip = true;

            this.updateAABB();
            this.facingDirection.x = this.moveDirection.x;
            this.facingDirection.y = this.moveDirection.y;
        }
        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y;
        this.sprite.tick();

    }

    render(game){

        this.sprite.horizontalFlip = !this.horizontalFlip;
        this.sprite.render(game);
    }

    updateAABB(){
        this.AABB.minX = this.collisionBox.minX + this.x;
        this.AABB.maxX = this.collisionBox.maxX + this.x;
        this.AABB.minY = this.collisionBox.minY + this.y;
        this.AABB.maxY = this.collisionBox.maxY + this.y;
        //console.log(this.AABB);
    }

    // Do a AABB test against an entity
    doesCollide(otherEntity){
        if (otherEntity.AABB == null || this.AABB == null || otherEntity == this) return false;
        return (otherEntity.AABB.minX <= this.AABB.maxX && otherEntity.AABB.maxX >= this.AABB.minX) &&
         (otherEntity.AABB.minY <= this.AABB.maxY && otherEntity.AABB.maxY >= this.AABB.minY);
    }

    onCollision(game,otherEntity){
    }

    hit(game,ammount){
        console.log(this.hitDelayCounter);
        if (this.hitDelayCounter >0) return;
        this.health -= ammount;
        this.onHit(game);
        this.hitDelayCounter = this.hitDelay;
    }

    onHit(game){
        
    }

    onDeath(game){

    }

    canMove(game,x,y){
        
        // Set our AABB that will be tested for collision. The AABB is our size + the position we want to move to.
        this.tempAABB.minX = this.collisionBox.minX + x;
        this.tempAABB.maxX = this.collisionBox.maxX + x;
        this.tempAABB.minY = this.collisionBox.minY + y;
        this.tempAABB.maxY = this.collisionBox.maxY + y;

        // check in a radius around the entity. Since out position is in the upper left corner we must transform it to the middle first. Otherwise
        // the check will only be positive on one side. This is only used to get the surronding tiles. The actual collision is using the AABB above.
        var radius = 32;
        var halfScale = this.pixelScale/2;
        let x1 = Math.round(x + halfScale + radius);
        let y1 = Math.round(y + halfScale + radius);
        let x2 = Math.round(x + halfScale - radius);
        let y2 = Math.round(y + halfScale - radius);

        var t1 = this.checkIntersects(game, x1,y1);
        var t2 = this.checkIntersects(game, x2,y1);
        var t3 = this.checkIntersects(game, x1,y2);
        var t4 = this.checkIntersects(game, x2,y2);

        // The intersect calls above will return true if we are colliding with something which means we can't move and therefore return false, otherwise return true.
        if (t1 || t2 || t3 || t4) return false;

        return true;
    }

    checkIntersects(game,x,y){
        // Get the tile on the worldPosition x and y.
        let level = game.screen.level;
        let tileResult = level.getTileAndTilePositionAtWorldPosition(x,y);

        // The result contains an object with the tile and the tileposition (not world position).
        // If no tile was found return that we collide so we accidently doesn't walk outside the level. (This should happen (famous last words)).
        // If the tile is a floor tile return false since we wouldn't be able to move otherwise.
        if (tileResult.tile == null) return true;
        if (tileResult.tile == Tiles.floor1) return false;

        // Check with the tile if this entity will collide. Also pass in the tile position since each tile is a singleton and doesn't have a state but
        // it needs this position to do the calculation.
        return tileResult.tile.doesCollideWithEntity(this,tileResult.tileX,tileResult.tileY);
    }

    normalize(v) {
        let magnitude = Math.hypot(v.x, v.y);
        return magnitude ? (v.x /= magnitude, v.y /= magnitude, v) : v;
    }

    length(v){
        return Math.hypot(v.x, v.y);
    }
}

export default Entity;