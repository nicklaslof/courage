import Sprite from "../graphic/sprite.js";
import Animation from "./animation.js";

class Decoration{

    // Type: 
    // t = torch
    // c = red carpet
    constructor(level,x,y,sizeX,sizeY,type){
        this.x = x;
        this.y = y;
        this.type = type;

        this.anim = new Animation();

        switch(type){
            case "t":
                this.anim.addState("a",new Sprite(this.x,this.y,16,65,2,6,sizeX,sizeY,0xffffffff),320).addState("a",new Sprite(this.x,this.y,18,65,2,6,sizeX,sizeY,0xffffffff),320);
                level.addLight(x,y,0xff55aaff,576,576,10000,true);
                break;
            case "c":
                this.anim.addState("a", new Sprite(this.x,this.y,0,0,16,16,64,64,0xff0000ff).setRotation(Math.random()<0.45?3.14:0));
                break;
            case "d":
                this.anim.addState("a", new Sprite(this.x,this.y,0,0,16,16,64,64,level.getTileRoom(Math.floor(x/64),Math.floor(y/64)).floorColor*10).setRotation(Math.random()<0.45?3.14:0));
                break;
            case "b":
                let xx = Math.random()*8;
                let yy = Math.random()*8;
                this.anim.addState("a", new Sprite(this.x,this.y,xx,48+yy,xx,yy,10,10,0xffffffff));
                break;
        }
        
        this.anim.setCurrentState("a");
    }

    tick(game,deltaTime){
        this.anim.tick(game,deltaTime);
        this.sprite = this.anim.currentSprite;
        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y;
        this.sprite.tick();
    }
    render(game){
        if (this.sprite != null) this.sprite.render(game);
    }
}

export default Decoration;