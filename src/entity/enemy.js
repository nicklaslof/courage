import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Enemy extends Entity{
    constructor(x,y){
        super(x,y,new Sprite(x,y,0,112,16,16,48,48,0xffffffff),{minX:16,minY:10,maxX:48,maxY:58});
        
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
    }

    render(game){
        super.render(game);
    }

}
export default Enemy;