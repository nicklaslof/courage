import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";

class Fire extends Enemy{
    constructor(game,x,y,c,speed,size){
        super(game,x,y,new Sprite(x,y,32,64,9,8,size*1.2,size*1.2,0xffffffff));
        this.speed = speed;
        size *= 1.2;

        this.collisionBox = {minX:0,minY:0,maxX:size+2,maxY:size+6};
        this.updateAABB();

        this.anim = new Animation();
        //this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("b", new Sprite(x,y,32,64,9,8,size,size,0xffffffff),240)
        .addState("b", new Sprite(x,y,41,64,9,8,size,size,0xffffffff),240);
        this.anim.setCurrentState("b");
        this.moveToPlayerRange = 1024;

        this.spitTimer = this.shootTimer = 0;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.anim.setCurrentState("b");
        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff0044cc,256,256,10000,true);
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);

        if (this.shootTimer > 0) this.shootTimer -= deltaTime;
        else {
            if (!this.spit && Math.random() < 0.2){
                this.spit = true;
                this.spitTimer = 1000;
                this.shootTimer = 500; //Check random every 500ms, otherwise timing issue where higher ticks/fps will get more bullets since it checks the random function more often.
            }
        }

        if (this.spit){
            this.spitTimer -= deltaTime;
            this.moveDirection.x = this.moveDirection.y = 0;

            if (this.spitTimer < 500 && !this.hasSpit){
                this.hasSpit = true;
                
                let player = game.screen.level.player;
                this.calculatePlayerDirectionVector.x = player.x - this.x;
                this.calculatePlayerDirectionVector.y = player.y - this.y;
                if (game.length(this.calculatePlayerDirectionVector) < 400 && game.canEntitySee(game.screen.level,player.x,player.y,this.x,this.y)) {
                    this.normalize(this.calculatePlayerDirectionVector);
                    game.screen.level.addEntity(new Bullet(game,this.x+18,this.y+16,6000,200, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff0088ff,{x:player.x,y:player.y},true,new Sprite(this.x,this.y,32,74,7,5,16,16,0xffffffff)));
                }
            }

            if (this.spitTimer <= 0) this.spit = this.hasSpit = false;
        }

    }


    onDeath(game){
        super.onDeath(game);
        game.screen.level.removeLight(this.light);
    }
}
export default Fire;