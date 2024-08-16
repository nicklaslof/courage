import Level from "../level/level.js";

class Screen{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.level = new Level(32,32);
    }

    tick(game, deltaTime){
        this.level.tick(game, deltaTime);
    }

    render(game){
        this.level.render(game);

    }

    renderLight(game){
        this.level.renderLight(game);
    }

    renderUI(game){
        this.level.renderUI(game);
    }
}

export default Screen;