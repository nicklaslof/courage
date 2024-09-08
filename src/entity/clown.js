import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";

class Clown extends Enemy{
        
    constructor(game,x,y,c,speed,size,boss){
        super(game,x,y,new Sprite(x,y,0,80,9,14,Math.max(28,size),Math.max(28,size),0xffffffff));
        this.speed = 20;
        this.c = 0xffffffff;
        size = Math.max(28,size);

        this.collisionBox = {minX:0,minY:0,maxX:size+2,maxY:size+6};
        this.updateAABB();
        this.anim = new Animation();
        this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("a", new Sprite(x,y,0,80,9,14,size,size,0xffffffff),120)
        .addState("a", new Sprite(x,y,9,80,9,14,size,size,0xffffffff),120);
        this.anim.setCurrentState("i");
        this.moveToPlayerRange = 800;

        this.throwCounter = 0;
        this.throwCountdown = 0;
        this.shootTimer = 0;
        this.throwLocation = {x:0,y:0};
        this.throw = false;

        this.boss = boss;

        if (boss){
            this.health = 30;
            this.speed = 0;
            this.hitDelay = 1000;
            this.bossStage = 0;
            this.stageSwitchCountdown = 1000;
            this.bossStageCounter = 5000;
        }
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.idle) return;


        if (this.boss){
            if (this.bossStage == 0) return;

            this.stageSwitchCountdown -= this.stageSwitchCountdown > 0 ? deltaTime : 0;

            let player = game.screen.level.player;
            this.calculatePlayerDirectionVector.x = player.x - this.x-48;
            this.calculatePlayerDirectionVector.y = player.y - this.y-48;
            this.normalize(this.calculatePlayerDirectionVector);

            this.throwCountdown -= deltaTime*game.getGamerule().bossBulletSpeed;
            this.anim.setCurrentState("a");

            if (this.stageSwitchCountdown < 1){
                    if (this.throwCountdown < 1){
                        game.screen.level.addEntity(new Bullet(game,
                        this.x + 48, this.y + 48, 5000, 400, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y, this, 0xffffffff, null, null,new Sprite(0, 0, 0, 64, 6, 6, 32, 32, 0xff0000ff), { minX: 0, minY: 0, maxX: 32, maxY: 32 }, 10
                        ));
                        this.throwCountdown = 300/this.bossStage;
                        
                    }

                    if (this.health == 20 && !this.firstWaveSpawned){
                        this.spawnBossAdds(game,2,2);
                        this.firstWaveSpawned = true;
                        this.bossStage++;
                        this.throwCountdown = 6000*game.getGamerule().bossBulletSpeed;
                    }
                    if (this.health == 15 && !this.secondWaveSpawned){
                        this.spawnBossAdds(game,3,3);
                        this.secondWaveSpawned = true;
                        this.bossStage++;
                        this.throwCountdown = 6000*game.getGamerule().bossBulletSpeed;
                    }
                    if (this.health == 10 && !this.thirdWaveSpawned){
                        this.spawnBossAdds(game,4,3);
                        this.thirdWaveSpawned = true;
                        this.bossStage++;
                        this.throwCountdown = 6000*game.getGamerule().bossBulletSpeed;
                    }
                    if (this.health == 5 && !this.fourthWaveSpawned){
                        this.spawnBossAdds(game,5,3);
                        this.fourthWaveSpawned = true;
                        this.bossStage++;
                        this.throwCountdown = 6000*game.getGamerule().bossBulletSpeed;
                    }
                    if (this.health == 1 && !this.fifthWaveSpawned){
                        this.spawnBossAdds(game,10,4);
                        this.fifthWaveSpawned = true;
                    }
                }      
        } else {
            if (this.shootTimer > 0) this.shootTimer -= deltaTime;
            else{
                this.throw = Math.random()<0.8;
                this.shootTimer = 500; //Check random every 500ms, otherwise timing issue where higher ticks/fps will get more bullets since it checks the random function more often.
            }

            if (this.throw){
                this.throwCountdown -= deltaTime;
                if (this.throwLocation.x == 0 && this.throwLocation.y == 0){
                    this.throwLocation.x = game.screen.level.player.x;
                    this.throwLocation.y = game.screen.level.player.y;
                }
                    let player = game.screen.level.player;
                    this.calculatePlayerDirectionVector.x = this.throwLocation.x + game.getRandom(-16,16) - this.x;
                    this.calculatePlayerDirectionVector.y = this.throwLocation.y + game.getRandom(-16,16) - this.y;
                    if (this.throwCountdown <= 0){
                        this.throwCounter++;
                        this.throwCountdown = 60;
                        if (game.length(this.calculatePlayerDirectionVector) < 220 && game.canEntitySee(game.screen.level,this.throwLocation.x,this.throwLocation.y,this.x,this.y)) {
                            this.anim.setCurrentState("a");
                            this.normalize(this.calculatePlayerDirectionVector);
                            game.screen.level.addEntity(new Bullet(game,this.x+18,this.y+16,1500,280, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff0000ff));

                        }
                    }

                    if (this.throwCounter > 4){
                        this.throwCounter = 0;
                        this.throw = false;
                        this.throwLocation.x = 0;
                        this.throwLocation.y = 0;
                        this.anim.setCurrentState("i");
                    }
            }
        }
    }

    spawnBossAdds(game,number,health) {
        let modifier = game.getGamerule().spawnRate;
        for (let i = 0; i < number*(modifier>0.5?game.getGamerule().spawnRate:1); i++) {
            let e = new Clown(game,game.getRandom((this.room.x + 2) * 64, (this.room.x + this.room.width - 2) * 64), game.getRandom((this.room.y + 2) * 64, (this.room.y + this.room.height - 2) * 64), 0xffffffff, 20, 64, false);
            e.health = health;
            e.speed = 0;
            game.screen.level.addEntity(e);
        }
    }

    onPlayerEnter(game,room){
        if (this.boss) this.bossStage = 1;
        this.room = room;
    }

    onCollision(game,otherEntity){
        if (otherEntity.boss){
            this.disposed = true;
        }else{
            super.onCollision(game,otherEntity);
        }
    }
}
export default Clown;