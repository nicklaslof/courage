
import Level from "../level/level.js";
import Bug from "../entity/bug.js";
import Spider from "../entity/spider.js";
import Sprite from "../graphic/sprite.js";
import Courage from "../entity/courage.js";

class Screen{
    constructor(game,width, height){
        this.width = width;
        this.height = height;

        //this.level = new Level(game,256,256,1,"Fear of insects",0xffcccccc,0xff999999,[Bug],0.09);
        //this.level = new Level(game,256,256,2,"Fear of spiders",0xff333333,0xff559955, [Spider],0.09);
        this.level = new Level(game,256,256,3,"Fear of being alone",0xff666666,0xff666666, [Courage],0.01);
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