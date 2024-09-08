import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";

class Bug extends Enemy{

    constructor(game,x,y,c,speed,size){
        super(game,x,y,new Sprite(x,y,0,96,9,8,size,size,c));
        this.speed = speed/1.2;
        this.collisionBox = {minX:0,minY:0,maxX:size,maxY:size};
        this.updateAABB();

        this.anim = new Animation();
        this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("w", new Sprite(x,y,0,96,9,8,size,size,c),240)
        .addState("w", new Sprite(x,y,0,105,9,8,size,size,c),240);
        this.anim.setCurrentState("i");
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        let r = Math.atan2(this.moveDirection.y,this.moveDirection.x);
        this.sprite.setRotation(r+Math.PI/2);
  
    }

    onEntityMovement(game,deltaTime){
        this.anim.setCurrentState("w");
    }

    onEntityStopMovement(game,deltaTime){
        this.anim.setCurrentState("i");
    }
}

export default Bug;