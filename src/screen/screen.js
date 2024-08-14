
import Sprite from "../graphic/sprite.js";
import Level from "../level/level.js";

class Screen{
    constructor(width, height){
        this.width = width;
        this.height = height;



        this.level = new Level(32,32);
    }

    tick(deltaTime){
        this.level.tick(deltaTime);

    }

    render(game){
        this.level.render(game);
    }

    renderLight(game){
        this.level.renderLight(game);
    }

}

export default Screen;