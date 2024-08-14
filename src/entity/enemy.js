import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Enemy extends Entity{
    constructor(x,y){
        super(x,y,new Sprite(x,y,48,48,16,16,32,32,0xff999999));
        
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
    }

    render(game){
        super.render(game);
    }

}
export default Enemy;