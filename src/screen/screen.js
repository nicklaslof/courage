
import Level from "../level/level.js";
import Bug from "../entity/bug.js";
import Spider from "../entity/spider.js";
import Sprite from "../graphic/sprite.js";
import Courage from "../entity/courage.js";
import Ghost from "../entity/ghost.js";
import Clown from "../entity/clown.js";

class Screen{
    constructor(game,width, height){
        this.width = width;
        this.height = height;

        //this.level = new Level(game,256,256,1,"Fear of insects",0xffcccccc,0xff999999,[Bug],0.09,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
        //this.level = new Level(game,256,256,2,"Fear of spiders",0xff333333,0xff559955, [Spider],0.09,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
        //this.level = new Level(game,256,256,3,"Fear of being alone",0xff666666,0xff666666, [Courage],0.03,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
       //this.level = new Level(game,256,256,4,"Fear of darkness and ghosts",0xff666666,0xff666666, [Ghost],0.09,{r:0.0,g:0.0,b:0.0,a:1.0},false,8,15,9);
       //this.level = new Level(game,256,256,5,"Fear of clowns",0xffcc99ff,0xff9999ff,[Clown],0.08,{r:0.3,g:0.3,b:0.3,a:1.0},true,8,15,9);
       //this.level = new Level(game,512,512,6,"Fear of confined spaces and rooms",0xffff4444,0xffff4444,[Courage],0.03,{r:0.3,g:0.3,b:0.3,a:1.0},true,6,6,30);


       //this.tryAndCreateLevel(game,256,256,1,"Fear of insects",0xffcccccc,0xff999999,[Bug],0.09,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
       //this.tryAndCreateLevel(game,256,256,2,"Fear of spiders",0xff333333,0xff559955, [Spider],0.09,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
       //this.tryAndCreateLevel(game,256,256,3,"Fear of being alone",0xff666666,0xff666666, [Courage],0.03,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9);
       //this.tryAndCreateLevel(game,256,256,4,"Fear of darkness and ghosts",0xff666666,0xff666666, [Ghost],0.09,{r:0.0,g:0.0,b:0.0,a:1.0},false,8,15,9);
       //this.tryAndCreateLevel(game,256,256,5,"Fear of clowns",0xffcc99ff,0xff9999ff,[Clown],0.08,{r:0.3,g:0.3,b:0.3,a:1.0},true,8,15,9);
       this.tryAndCreateLevel(game,512,512,6,"Fear of confined spaces and rooms",0xffff4444,0xffff4444,[Courage],0.06,{r:0.3,g:0.3,b:0.3,a:1.0},true,7,8,30);
    }

    tryAndCreateLevel(game,width,height,chapter,name,wallColor,floorColor,mobSpawns,mobSpawnChance,globalDarkness,torches,minRoomSize,maxRoomSize,numberOfRooms){
        while (this.level == null){
            let level = new Level(game,width,height,chapter,name,wallColor,floorColor,mobSpawns,mobSpawnChance,globalDarkness,torches,minRoomSize,maxRoomSize,numberOfRooms);
            if (level.allRoomsCreated) this.level = level;
            else console.log("FAILED TO CREATE LEVEL");
            console.log(this.level);
        }
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