import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";

class Clown extends Enemy{
        
    constructor(x,y,c,speed,size){
        super(x,y,new Sprite(x,y,0,80,9,14,32,32,0xffffffff));
        this.speed = 20;
        this.c = 0xffffffff;

        this.collisionBox = {minX:0,minY:0,maxX:size+2,maxY:size+6};
        this.updateAABB();
        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("attack", new Sprite(x,y,0,80,9,14,32,32,0xffffffff),120)
        .addState("attack", new Sprite(x,y,9,80,9,14,32,32,0xffffffff),120);
        this.animation.setCurrentState("idle");
        this.moveToPlayerRange = 800;

        this.throwCounter = 0;
        this.throwCountdown = 0;
        this.throwLocation = {x:0,y:0};
        this.throw = false;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.idle) return;
        if (!this.throw && Math.random() < 0.2){
            this.throw = true;
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
                    this.throwCountdown = 100;
                    if (game.length(this.calculatePlayerDirectionVector) < 180 && game.canEntitySee(game.screen.level,this.throwLocation.x,this.throwLocation.y,this.x,this.y)) {
                        this.animation.setCurrentState("attack");
                        this.normalize(this.calculatePlayerDirectionVector);
                        game.screen.level.addEntity(new Bullet(this.x+18,this.y+16,3000,300, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff0000ff));

                    }
                }

                if (this.throwCounter > 4){
                    this.throwCounter = 0;
                    this.throw = false;
                    this.throwLocation.x = 0;
                    this.throwLocation.y = 0;
                    this.animation.setCurrentState("idle");
                }

            //if (this.throwTimer <= 0) this.throw = this.hasThrown = false;
        }
    }
}
export default Clown;