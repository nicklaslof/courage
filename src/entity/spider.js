import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bug from "./bug.js";

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
    }
}

export default Spider;