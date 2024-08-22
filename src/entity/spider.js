import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bug from "./bug.js";
import Bullet from "./bullet.js";

class Spider extends Bug{
    constructor(x,y,c,speed,size){
        super(x,y,c,speed,size);
        this.sprite = new Sprite(x,y,16,96,16,16,size,size,c);
        console.log(this.sprite);
        this.speed = speed/2;

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,16,96,16,16,size,size,c),240)
        .addState("walk", new Sprite(x,y,32,96,16,16,size,size,c),240);
        this.animation.setCurrentState("idle");

        this.spitTimer = 0;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (!this.spit && Math.random() < 0.005){
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
                if (game.length(this.calculatePlayerDirectionVector) < 400 && game.canEntitySee(game.screen.level,player.x,player.y,this.x,this.y)) {
                    this.normalize(this.calculatePlayerDirectionVector);
                    game.screen.level.addEntity(new Bullet(this.x+18,this.y+16,6000,140, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff00ff00,{x:player.x,y:player.y}));
                }
            }

            if (this.spitTimer <= 0) this.spit = this.hasSpit = false;
        }
    }
}

export default Spider;