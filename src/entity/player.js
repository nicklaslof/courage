import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";

import Bullet from "./bullet.js";
import Pickup from "./pickup.js";

import Entity from "./entity.js";
import Box from "./box.js";
import Tile from "../tile/tile.js";
import Bomb from "./bomb.js";
import Explosion from "./explosion.js";
import Enemy from "./enemy.js";

class Player extends Entity{
    constructor(game,x,y,pixelScale){
        super(game,x,y,new Sprite(x,y,0,112,16,16,pixelScale,pixelScale,0xffffffff),10,{minX:11,minY:5,maxX:35,maxY:51});
        this.speed = 300;
        this.playerSpeed = 300;
        this.pixelScale = pixelScale;
        this.canShoot = true;
        this.canThrowBomb = true;
        this.fireDelay = 0;
        this.bombDelay = 0;
        this.aimX = this.aimY = 0;
        this.health = 20;
        this.bombs = 0;
        this.hitDelay = 240;
        this.courageFullPlayed = false;
        this.canglide = true;
        this.glideCountdown = 0;
        this.glideSpeed = 0;
        this.damageImmune = false;
        this.damageImmuneCounter = 0;
        this.walkSoundCounter = 0;
        this.bombMessageTimeout = 0;
        

        this.anim = new Animation();
        this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("w", new Sprite(x,y,16,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("w", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240).addState("w", new Sprite(x,y,32,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),160)
        .addState("w", new Sprite(x,y,0,112,16,16,this.pixelScale,this.pixelScale,0xffffffff),240);
        
        this.anim.setCurrentState("i");

        this.aimSprite = new Sprite(this.x,this.y,0,71,7,7,24,24,0xffffffff);
        this.currentTile = null;
        this.currentRoom = this.previousRoom = null;

    }

    tick(game,deltaTime){
        this.currentTile = game.screen.level.getTile(Math.floor(this.x/64),Math.floor(this.y/64));
        this.currentRoom = game.screen.level.getTileRoom(Math.floor(this.x/64),Math.floor(this.y/64));

        if (this.glideCountdown > 0) this.glideCountdown -= deltaTime;
        else this.canglide = true;

        if (this.damageImmuneCounter > 0) this.damageImmuneCounter -= deltaTime;
        else this.damageImmune = false;

        if (this.walkSoundCounter >0) this.walkSoundCounter -= deltaTime;

        if (this.bombMessageTimeout >0) this.bombMessageTimeout -= deltaTime;
        

        if (this.walkSoundCounter <=0 && (game.input.axes.x != 0 || game.input.axes.y != 0) && this.glideSpeed < 1){
            game.playPlayerRunning();
            this.walkSoundCounter = 360;

        }

        let deltaSeconds = deltaTime / 1000;
        let speedReduction = 0.999995;
        let decay = Math.pow(1 - speedReduction, deltaSeconds);
        this.glideSpeed *= decay;

        if (game.input.axes.x !=0 || game.input.axes.y !=0){
            this.moveDirection.x = game.input.axes.x;
            this.moveDirection.y = game.input.axes.y;
            this.speed = this.playerSpeed + this.glideSpeed;
            this.anim.setCurrentState("w")
        }else{
            this.speed += this.glideSpeed;
            this.speed *= decay;
            this.anim.setCurrentState("i");
        }

        if (game.input.getGlide() && this.canglide && this.glideSpeed < 1){
            if (this.speed > this.playerSpeed-1){
                this.glideSpeed = 700;
                this.glideCountdown = 1000;
                this.canglide = false;
                this.damageImmune = true;
                this.damageImmuneCounter = 750;
                game.playGlide();  
            }
          
        }
        if (this.speed > 980) this.speed = 980;
        if (this.glideSpeed > 10){
            this.anim.setCurrentState("i");
            game.screen.level.addParticle(this.x+24,this.y+this.pixelScale,0x99dddddd,game.getRandom(1,12),game.getRandom(1,12),1500,{x:game.getRandom(-1,1),y:game.getRandom(-1,1)},game.getRandom(50,120));
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

        if (this.fireDelay > 0)this.fireDelay -= deltaTime;
        

        if (this.fireDelay <= 0 && !this.canShoot) this.canShoot = true;

        if (this.bombDelay > 0) this.bombDelay -= deltaTime;
        

        if (this.bombDelay <= 0 && !this.canThrowBomb) this.canThrowBomb = true;
       
       // 
       let aim = {x:this.aimX-24 ,y:this.aimY-32};
       this.normalize(aim);
        if (game.input.firePressed && this.canShoot){


            game.screen.level.addEntity(new Bullet(game,this.x+16,this.y+32,600,700,aim.x, aim.y,this));
            this.canShoot = false;
            this.fireDelay = 128;
            game.playShoot();
        }

        if (this.bombs > 0 && game.input.bombPressed && this.canThrowBomb){
            let aimWorld = this.projectScreenToWorld(game,this.aimX,this.aimY);
            game.screen.level.addEntity(new Bomb(game,this.x+16,this.y+20,2000,800,aim.x,aim.y,this,aimWorld));
            this.canThrowBomb = false;
            this.bombDelay = 1000;
            this.bombs--;
        }

        if (this.currentRoom != null && this.previousRoom != this.currentRoom){
            this.roomChange(game);
            this.previousRoom = this.currentRoom;
        }

        //if (this.currentRoom != null) this.currentRoom.tick(game,deltaTime);

        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff447777,512,512,10000,false);
        this.light.renderOffsetX = 20;
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);
        if (!game.screen.level.bossLevel && this.health == 100 && !this.courageFullPlayed){
            this.courageFullPlayed = true;
            game.playFullCourage();
            game.setPlayerSays("I have the courage to leave now!",5000);
        }
        if (this.health < 100 && this.courageFullPlayed){
            game.setPlayerSays("I lost my courage,I can't leave now!",5000);
            this.courageFullPlayed = false;
        }

    }

    projectScreenToWorld(game, screenX,screenY){
        return {x: game.screen.level.player.x + screenX, y: game.screen.level.player.y + screenY};
    }

    bombPickup(game){
        this.bombs++;
        if (this.bombMessageTimeout <= 0){
            this.bombMessageTimeout = 120000;
            game.setPlayerSays("I found a bomb,throw it with E",8000);
        }
    }

    render(game){
        super.render(game);
    }

    onCollision(game,otherEntity){
        if (otherEntity instanceof Bullet && otherEntity.shootingEntity == this ) return;
        if (otherEntity instanceof Box) return;
        if (otherEntity instanceof Pickup) return;
        if (otherEntity instanceof Tile) return;
        if (otherEntity instanceof Bomb) return;
        if (otherEntity instanceof Explosion) return;
        if (otherEntity instanceof Enemy) this.hit(game,1);
    }

    roomChange(game){
        if (this.currentRoom != null) this.currentRoom.onPlayerEnter(game);
    }

    renderUI(game){
        this.aimSprite.render(game);
    }

    onHit(game){
        //if (entity instanceof Bullet && entity.shootingEntity == this) return;
        if (this.glideSpeed < 10) game.playPlayerHit();
    }
}
export default Player;