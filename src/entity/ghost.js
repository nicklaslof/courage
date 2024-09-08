import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";
import Enemy from "./enemy.js";

class Ghost extends Enemy{
    constructor(game,x,y,c,speed,size){
        super(game,x,y,new Sprite(x,y,48,96,4,8,32,32,c));
        this.speed = speed;

        this.collisionBox = {minX:0,minY:0,maxX:32,maxY:32};

        this.anim = new Animation();
        //this.anim.addState("i",this.sprite,0.1);
        this.anim.addState("w", new Sprite(x,y,48,96,4,8,32,32,c),240)
        .addState("w", new Sprite(x,y,52,96,4,8,32,32,c),240);
        this.anim.setCurrentState("w");
        this.moveToPlayerRange = 1024;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.light == null) this.light = game.screen.level.addLight(this.x,this.y,0xff7b367a,96,96,10000,false);
        this.light.x = this.x;
        this.light.y = this.y;
        this.light.renderOffsetX = 20;
        this.light.renderOffsetY = 16;
        this.light.tick(game,deltaTime);
    }

    onDeath(game){
        super.onDeath(game);
        game.screen.level.removeLight(this.light);
    }
}
export default Ghost;