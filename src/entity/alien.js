import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";

class Alien extends Enemy{
    constructor(game,x,y,c,speed,size){
        super(game,x,y,new Sprite(x,y,51,64,7,7,32,32,0xffffffff));

        this.collisionBox = {minX:0,minY:0,maxX:size+2,maxY:size+6};
        this.updateAABB();
        
        this.anim = new Animation();
        this.anim.addState("b", new Sprite(x,y,51,64,7,7,32,32,0xffffffff),1024)
        .addState("b", new Sprite(x,y,58,64,7,7,32,32,0xffffffff),240)
        .addState("b", new Sprite(x,y,51,71,7,7,32,32,0xffffffff),240)
        .addState("b", new Sprite(x,y,58,64,7,7,32,32,0xffffffff),240)
        .addState("b", new Sprite(x,y,51,64,7,7,32,32,0xffffffff),240);
        this.anim.setCurrentState("b");
        this.moveAwayRange = this.spitDelay = this.shootTimer = 0;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.moveAwayRange = this.moveAwayRange == 0 ? game.getRandom(150,400) : this.moveAwayRange;
        let player = game.screen.level.player;
        this.calculatePlayerDirectionVector.x = player.x - this.x;
        this.calculatePlayerDirectionVector.y = player.y - this.y;

        if (game.length(this.calculatePlayerDirectionVector) < 280){

            this.moveDirection.x = -this.moveDirection.x;
            this.moveDirection.y = -this.moveDirection.y;
        }
        this.anim.setCurrentState("b");

        if (this.shootTimer > 0) this.shootTimer -= deltaTime;
        else{
            if (game.length(this.calculatePlayerDirectionVector) < this.moveAwayRange+40){
                if (!this.spitOnPlayer && Math.random() < 0.005){
                    this.spitOnPlayer = true;
                    this.spitOnPlayerCountdown = game.getRandom(1000,1500);
                    this.shootTimer = 500; //Check random every 500ms, otherwise timing issue where higher ticks/fps will get more bullets since it checks the random function more often.
                }
            }
        }
        
        if (this.spitOnPlayer){
            this.spitDelay -= deltaTime;
            this.spitOnPlayerCountdown -= deltaTime;

            if (this.spitDelay <= 0){
                let player = game.screen.level.player;
                this.calculatePlayerDirectionVector.x = player.x - this.x;
                this.calculatePlayerDirectionVector.y = player.y - this.y;
                this.normalize(this.calculatePlayerDirectionVector);

                game.screen.level.addEntity(new Bullet(game,this.x+16,this.y+16,1200,200,this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff00ff00));

                this.spitDelay = 400;
            }
        }
        if (this.spitOnPlayerCountdown <= 0) this.spitOnPlayer = false;
        
    }
}

export default Alien;