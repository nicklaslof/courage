import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bug from "./bug.js";
import Bullet from "./bullet.js";
import Pickup from "./pickup.js";

class Spider extends Bug{
    constructor(x,y,c,speed,size,boss){
        super(x,y,c,speed,size);
        this.sprite = new Sprite(x,y,16,96,16,16,size,size,c);
        this.speed = speed/2.5;

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,16,96,16,16,size,size,c),240)
        .addState("walk", new Sprite(x,y,32,96,16,16,size,size,c),240);
        this.animation.setCurrentState("idle");

        this.spitTimer = 0;
        this.boss = boss;

        this.shootCounter = this.shootAngle = this.bulletCounter = 0;

        if (boss){
            this.health = 30;
            this.hitDelay = 1000;
            this.bossStage = this.stageSwitchCountdown = 7000;
            this.bossStageCounter = 5000;
        }
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);


        if (this.boss){
            if (this.bossStage == 0) return;
            this.stageSwitchCountdown -= this.stageSwitchCountdown > 0 ? deltaTime : 0;
            this.bossStageCounter -= deltaTime;
        
            if (this.bossStageCounter <= 0) {
                this.bossStage = Math.min(this.bossStage + 1, 5);
                this.stageSwitchCountdown = 3000;
                this.bossStageCounter = 8000;
            }
        
            let numberOfBullets = this.health < 2 ? -1 : 6 - this.bossStage;
            this.shootCounter += deltaTime;
        
            if ((this.stageSwitchCountdown < 1 || this.health < 2) && this.shootCounter >= 96 / numberOfBullets) {
                let s = Math.sin(this.shootAngle / 3.14), c = Math.cos(this.shootAngle / 3.14);
                game.screen.level.addEntity(
                    new Bullet(
                        this.x + 48, this.y + 48, 5000, 200 * (numberOfBullets / 2), s, c, this, 0xffffffff, null, null,new Sprite(0, 0, 0, 64, 6, 6, 32, 32, 0xff00ff00), { minX: 0, minY: 0, maxX: 32, maxY: 32 }, 10
                ));
                if (++this.bulletCounter >= numberOfBullets) {
                    this.shootAngle++;
                    this.bulletCounter = 0;
                }
                this.shootCounter = 0;
            }
        }
        else{
            if (!this.spit && Math.random() < 0.001){
                this.spit = true;
                this.spitTimer = 1000;
            }

            if (this.spit){
                this.spitTimer -= deltaTime;
                this.moveDirection.x = this.moveDirection.y = 0;

                if (this.spitTimer < 500 && !this.hasSpit){
                    this.hasSpit = true;
                    
                    let player = game.screen.level.player;
                    this.calculatePlayerDirectionVector.x = player.x - this.x;
                    this.calculatePlayerDirectionVector.y = player.y - this.y;
                    if (game.length(this.calculatePlayerDirectionVector) < 350 && game.canEntitySee(game.screen.level,player.x,player.y,this.x,this.y)) {
                        this.normalize(this.calculatePlayerDirectionVector);
                        game.screen.level.addEntity(new Bullet(this.x+18,this.y+16,5000,150, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff00ff00,{x:player.x,y:player.y}));
                    }
                }

                if (this.spitTimer <= 0) this.spit = this.hasSpit = false;
            }
        }
    }

    onPlayerEnter(game){
        if (this.boss) this.bossStage = 1;
    }

    onHit(game){
        super.onHit(game);
        if(this.boss) game.playBossHit();
        console.log(this.hitDelayCounter);
    }

    onDeath(game){
        super.onDeath(game);
        for (let i = 0; i < 100;i++){
            game.screen.level.addEntity(new Pickup(this.x+32+game.getRandom(-128,128),this.y+32+game.getRandom(-128,128),game.getRandom(-1,1),Math.random()<0.05?"b":"c"));
        }
    }
}

export default Spider;