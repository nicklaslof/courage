import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bug from "./bug.js";
import Bullet from "./bullet.js";

class Spider extends Bug{
    constructor(game,x,y,c,speed,size,boss){
        super(game,x,y,c,speed,size);
        this.sprite = new Sprite(x,y,16,96,16,16,size,size,c);
        this.speed = speed/2.5;

        this.anim = new Animation();
        this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("w", new Sprite(x,y,16,96,16,16,size,size,c),240)
        .addState("w", new Sprite(x,y,32,96,16,16,size,size,c),240);
        this.anim.setCurrentState("i");

        this.shootTimer = 0;
        this.boss = boss;

        this.playerLocation = {x:0,y:0};

        this.shootCounter = this.shootCountdown = this.shootAngle = this.bulletCounter = 0;

        if (boss){
            this.health = 30;
            this.hitDelay = 1000;
            this.bossStage = 0;
            this.stageSwitchCountdown = 7000;
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
            this.shootCounter += deltaTime*game.getGamerule().bossBulletSpeed;
        
            if ((this.stageSwitchCountdown < 1 || this.health < 2) && this.shootCounter >= 96 / numberOfBullets) {
                let s = Math.sin(this.shootAngle / 3.14), c = Math.cos(this.shootAngle / 3.14);
                game.screen.level.addEntity(
                    new Bullet(game,
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
            let player = game.screen.level.player;
            if (this.shootCountdown > 0) this.shootCountdown -= deltaTime;
            if (this.shootTimer > 0) this.shootTimer -= deltaTime;
            else{
                this.spit = Math.random()<0.2;
                this.shootTimer = 500; //Check random every 500ms, otherwise timing issue where higher ticks/fps will get more bullets since it checks the random function more often.

                this.playerLocation.x = player.x;
                this.playerLocation.y = player.y;
            }

            if (this.spit && this.shootCountdown < 1){
               
                this.calculatePlayerDirectionVector.x = this.playerLocation.x - this.x;
                this.calculatePlayerDirectionVector.y = this.playerLocation.y - this.y;
                if (game.length(this.calculatePlayerDirectionVector) < 350 && game.canEntitySee(game.screen.level,player.x,player.y,this.x,this.y)) {
                    this.normalize(this.calculatePlayerDirectionVector);
                    game.screen.level.addEntity(new Bullet(game,this.x+18,this.y+16,5000,150, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff00ff00,{x:player.x,y:player.y}));
                }
                this.shootCountdown = 100;
                this.spit = false;
            }

        }
    }

    onPlayerEnter(game){
        if (this.boss) this.bossStage = 1;
    }
}

export default Spider;