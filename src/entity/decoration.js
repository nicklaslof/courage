import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";

class Decoration{

    // Type: 
    // t = torch
    constructor(level,x,y,sizeX,sizeY,type){
        this.x = x;
        this.y = y;
        this.type = type;

        this.animation = new Animation();

        if (type == "t"){
            this.animation.addState("anim",new Sprite(this.x,this.y,16,65,2,6,sizeX,sizeY,0xffffffff),320).addState("anim",new Sprite(this.x,this.y,18,65,2,6,sizeX,sizeY,0xffffffff),320);
            level.addLight(x,y,0xff5599dd,576,576,10000,true);
        }

        this.animation.setCurrentState("anim");
    }

    tick(game,deltaTime){
        this.animation.tick(game,deltaTime);
        this.sprite = this.animation.currentSprite;
        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y;
        this.sprite.tick();
    }
    render(game){
        this.sprite.render(game);
    }
}

export default Decoration;