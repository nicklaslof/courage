import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Bullet from "./bullet.js";
import Enemy from "./enemy.js";

class Thirteen extends Enemy{
    constructor(x,y,c,speed,size){
        super(x,y,Math.random()< 0.5?new Sprite(x,y,16,48,3,6,32,32,0xffffffff):new Sprite(x,y,20,48,3,6,32,32,0xffffffff));
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.horizontalFlip = true;
    }
}

export default Thirteen;