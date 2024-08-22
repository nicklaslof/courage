
import Level from "../level/level.js";
import Bug from "../entity/bug.js";
import Spider from "../entity/spider.js";
import Sprite from "../graphic/sprite.js";

class Screen{
    constructor(game,width, height){
        this.width = width;
        this.height = height;

        //this.level = new Level(game,256,256,1,"Insects",0xffcccccc,0xff999999,[Bug]);
        this.level = new Level(game,256,256,2,"Spiders",0xff333333,0xff559955, [Spider]);
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