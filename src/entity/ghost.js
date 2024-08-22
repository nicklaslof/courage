import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";

class Ghost extends Enemy{
    constructor(x,y,c,speed,size){
        super(x,y,new Sprite(x,y,48,96,4,8,32,32,c));
        this.speed = speed;

        this.animation = new Animation();
        this.animation.addState("idle",this.sprite,0.1);
        this.animation.addState("walk", new Sprite(x,y,48,96,4,8,32,32,c),240)
        .addState("walk", new Sprite(x,y,52,96,4,8,32,32,c),240);
        this.animation.setCurrentState("idle");
        this.moveToPlayerRange = 1024;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff7b367a,64,64,10000,false);
        //this.light.renderOffsetX = 20;
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.tick(game,deltaTime);
    }

    onDeath(game){
        super.onDeath(game);
        game.screen.level.removeLight(this.light);
        
    }
}
export default Ghost;