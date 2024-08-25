import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";

import Bullet from "./bullet.js";
import Courage from "./courage.js";

import Entity from "./entity.js";
import Box from "./box.js";
import Tile from "../tile/tile.js";
import Spider from "./spider.js";
import Bomb from "./bomb.js";
import Explosion from "./explosion.js";

class Player extends Entity{
    constructor(x,y,pixelScale){
        super(x,y,new Sprite(x,y,0,112,16,16,pixelScale,pixelScale,0xffffffff),10,{minX:16,minY:10,maxX:48,maxY:58});
        this.speed = 360;
        this.playerSpeed = 360;
        this.pixelScale = pixelScale;
        this.canShoot = true;
        this.fireDelay = 0;
        this.aimX = this.aimY = 0;
        this.health = 20;
        this.hitDelay = 240;
        this.courageFullPlayed = false;
        

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("walk", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("walk", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
        
        this.animation.setCurrentState("idle");

        this.aimSprite = new Sprite(this.x,this.y,0,71,7,7,24,24,0xffffffff);
        this.currentTile = null;
        this.currentRoom = this.previousRoom = null;

    }

    tick(game,deltaTime){
        this.currentTile = game.screen.level.getTile(Math.floor(this.x/64),Math.floor(this.y/64));
        this.currentRoom = game.screen.level.getTileRoom(Math.floor(this.x/64),Math.floor(this.y/64));

        if (game.input.axes.x !=0 || game.input.axes.y !=0){
            this.moveDirection.x = game.input.axes.x;
            this.moveDirection.y = game.input.axes.y;
            this.speed = this.playerSpeed;
            this.animation.setCurrentState("walk")
        }else{
            let deltaSeconds = deltaTime / 1000;
            let speedReduction = 0.999995;
            let decay = Math.pow(1 - speedReduction, deltaSeconds);
            this.speed *= decay;

            this.animation.setCurrentState("idle");
        }

        if (this.speed < 1){
            this.moveDirection.x = 0;
            this.moveDirection.y = 0;
        }


        super.tick(game,deltaTime);

        // Overwrite player position set in the parent class tick function because player should always be rendered at center of the screen
        this.sprite.x = game.cameraCenterX;
        this.sprite.y = game.cameraCenterY;

        this.aimX += game.input.pointer.x;
        this.aimY += game.input.pointer.y;

        if (this.aimX > W/2) this.aimX = W/2;
        if (this.aimX < -W/2) this.aimX = -W/2;
        if (this.aimY > H/2) this.aimY = H/2;
        if (this.aimY < -H/2) this.aimY = -H/2;


        this.aimSprite.x = game.cameraCenterX+this.aimX;
        this.aimSprite.y = game.cameraCenterY+this.aimY;
        this.aimSprite.tick();

        //if (this.aimX > 0 ) this.horizontalFlip = true;
        //else this.horizontalFlip = false;

        if (this.fireDelay > 0){
            this.fireDelay -= deltaTime;
        }

        if (this.fireDelay <= 0 && !this.canShoot) this.canShoot = true;

       
       // 
       let aim = {x:this.aimX ,y:this.aimY};
       this.normalize(aim);
        if (game.input.firePressed && this.canShoot){


            game.screen.level.addEntity(new Bullet(this.x+24,this.y+32,600,700,aim.x, aim.y,this));
            this.canShoot = false;
            this.fireDelay = 128;
            game.playShoot();
        }

        if (game.input.bombPressed && this.canShoot){
            let aimWorld = this.projectScreenToWorld(game,this.aimX,this.aimY);
           // aimWorld.x = this.x + aim.x *300;
           // aimWorld.y = this.y + aim.y *300;
            //console.log(this.aimX + "  "+this.aimY   + "  "+aimWorld.x +"  "+aimWorld.y + "  player: "+this.x+ " "+this.y);
            game.screen.level.addEntity(new Bomb(this.x+32,this.y+32,2000,800,aim.x,aim.y,this,aimWorld));
            this.canShoot = false;
            this.fireDelay = 128;
        }

        if (this.currentRoom != null && this.previousRoom != this.currentRoom){
            this.roomChange(game);
            this.previousRoom = this.currentRoom;
        }

        if (this.currentRoom != null) this.currentRoom.tick(game,deltaTime);

        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff115555,512,512,10000,false);
        this.light.renderOffsetX = 20;
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);
        if (this.health == 100 && !this.courageFullPlayed){
            this.courageFullPlayed = true;
            game.playFullCourage();
        }

    }

    projectScreenToWorld(game, screenX,screenY){
        return {x: game.screen.level.player.x + screenX, y: game.screen.level.player.y + screenY};
    }

    render(game){
        super.render(game);
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Bullet && otherEntity.shootingEntity == this ) return;
        if (otherEntity instanceof Box) return;
        if (otherEntity instanceof Courage) return;
        if (otherEntity instanceof Tile) return;
        if (otherEntity instanceof Spider) return;
        if (otherEntity instanceof Bomb) return;
        if (otherEntity instanceof Explosion) return;
        this.hit(game,1);
    }

    roomChange(game){
        console.log("Room changed:" + this.currentRoom.roomId);
        if (this.currentRoom != null) this.currentRoom.onPlayerEnter(game);
    }

    renderUI(game){
        this.aimSprite.render(game);
    }

    onHit(game){
        //if (entity instanceof Bullet && entity.shootingEntity == this) return;
        game.playPlayerHit();
    }
}
export default Player;