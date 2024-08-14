import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Player extends Entity{
    constructor(x,y){
        super(x,y,new Sprite(x,y,48,48,16,16,48,48,0xffffffff));
        this.speed = 1.5;
    }

    tick(game,deltaTime){
        this.moveDirection.x = game.input.axes.x;
        this.moveDirection.y = game.input.axes.y;

        super.tick(deltaTime);


    }

    render(game){
        // Always render player at center of the screen
        this.sprite.x = game.cameraCenterX;
        this.sprite.y = game.cameraCenterY;
        this.sprite.horizontalFlip = !this.horizontalFlip;
        this.sprite.render(game);

    }
}
export default Player;