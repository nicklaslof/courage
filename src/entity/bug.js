import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";

class Bug extends Enemy{

    constructor(x,y,c,speed,size){
        super(x,y,new Sprite(x,y,0,96,9,8,size,size,c));
        this.speed = speed;

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,0,96,9,8,size,size,c),240)
        .addState("walk", new Sprite(x,y,0,105,9,8,size,size,c),240);
        this.animation.setCurrentState("idle");

        console.log(this.animation);
        console.log(this.sprite);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        let r = Math.atan2(this.moveDirection.y,this.moveDirection.x);
        this.sprite.setRotation(r+Math.PI/2);
  
    }


    onEntityMovement(game,deltaTime){
        this.animation.setCurrentState("walk");
    }

    onEntityStopMovement(game,deltaTime){
        this.animation.setCurrentState("idle");
    }

    onDeath(game){
        super.onDeath(game);
        game.playBugKilled();
    }
}

export default Bug;