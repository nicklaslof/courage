import Level from "../level/level.js";

class Screen{
    constructor(game,width, height){
        this.width = width;
        this.height = height;

        this.level = new Level(game,64,64);
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