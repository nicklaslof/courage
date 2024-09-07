
import Level from "../level/level.js";
import Bug from "../entity/bug.js";
import Spider from "../entity/spider.js";
import Pickup from "../entity/pickup.js";
import Ghost from "../entity/ghost.js";
import Clown from "../entity/clown.js";
import Fire from "../entity/fire.js";
import Alien from "../entity/alien.js";
import Thirteen from "../entity/thirteen.js";

const localStorageLevel = "snukey.courage.level";
class Screen{
    constructor(game,width, height){
        this.width = width;
        this.height = height;

        this.levels = [];
        this.levels.push(this.tryAndCreateLevel(game,256,256,1,"Fear of insects",0xffcccccc,0xff999999,[Bug],0.3,{r:0.2,g:0.2,b:0.5,a:1.0},true,8,20,7,false,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,2,"Fear of spiders",0xff333333,0xff559955, [Spider],0.3,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,11,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,2,"Spider mom",0xff333333,0xff559955, [Spider],0.3,{r:0.3,g:0.3,b:0.35,a:1.0},true,17,19,3,false,false,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,3,"Fear of being alone",0xff666666,0xff666666, [Pickup],0.5,{r:0.3,g:0.3,b:0.35,a:1.0},true,8,15,9,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,4,"Fear of darkness and ghosts",0xff666666,0xff666666, [Ghost],0.6,{r:0.0,g:0.0,b:0.0,a:1.0},false,8,15,9,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,5,"Fear of clowns",0xffcc99ff,0xff9999ff,[Clown],0.3,{r:0.3,g:0.3,b:0.3,a:1.0},true,8,15,9,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,5,"The clown",0xffcc99ff,0xff9999ff, [Clown],0.3,{r:0.3,g:0.3,b:0.3,a:1.0},true,17,19,3,false,false,true));
        this.levels.push(this.tryAndCreateLevel(game,512,512,6,"Fear of confined spaces and rooms",0xffff4444,0xffff4444,[Pickup],0.5,{r:0.3,g:0.3,b:0.3,a:1.0},true,7,8,30,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,7,"Fear of fire",0xff0044cc,0xff0085ff,[Fire],0.3,{r:0.1,g:0.1,b:0.5,a:1.0},false,8,15,9,true,true));
        this.levels.push(this.tryAndCreateLevel(game,256,256,8,"Fear of heights, outer space and aliens",0xff00ff00,0x22ffffff,[Alien],0.3,{r:0.4,g:0.4,b:0.5,a:1.0},false,20,25,4,false,false));
        this.levels.push(this.tryAndCreateLevel(game,256,256,9,"Fear of number 13",0xff222222,0xff555555,[Thirteen],0.3,{r:0.4,g:0.4,b:0.5,a:1.0},true,8,16,8,false,true));
        this.tryChangeLevel(game, null,localStorage.getItem(localStorageLevel));
        
    }

    tryAndCreateLevel(game,width,height,chapter,name,wallColor,floorColor,mobSpawns,mobSpawnChance,globalDarkness,torches,minRoomSize,maxRoomSize,numberOfRooms,lava,battleRoom,bossLevel=false){
        let newLevel = null;
        // This will loop until a level has been created. There is a slight chance a level fails to generate if the random generator creates a loop of rooms and can't find a direction
        // to generate a new room. So I'm safe to do an "eternal while true"-loop here since the levelgeneration is fast and if it fails it usually succedes the next time.
        // The only time if can make this to a real while true loop if trying to create too small rooms or huge rooms with not enough h and w of the level.
        while (newLevel == null){
            let level = new Level(game,width,height,chapter,name,wallColor,floorColor,mobSpawns,mobSpawnChance,globalDarkness,torches,minRoomSize,maxRoomSize,numberOfRooms,lava,battleRoom,bossLevel);
            if (level.allRoomsCreated) newLevel = level;
        }
        return newLevel;
    }

    // Change the level to the next level. If there are enimies left in the level and the player health(courage) is over 100 the player will leave but if it's below 100 the player will refuse to leave.
    // If there are no enemies left the player leaves even if the health(courage) isn't over 100 but that will make the player have even lower health(courage) on the next level.
    tryChangeLevel(game,player,levelId){
        if (levelId == null) levelId = 0;
        let remainingEnemies = game.screen.level!=null ? game.screen.level.getRemainingEnemies():1;
        if (this.currentLevelId == this.levels.length-1 && (player.health >= 100 || (player.health < 100 && remainingEnemies == 0))){
            game.switchToEndScreen();
            localStorage.setItem(localStorageLevel,0);
            return;
        }


        if (player != null && player.health < 100 && remainingEnemies > 0) game.setPlayerSays("I can't leave yet. I need more courage.",4000);
        if (player == null){
            this.level = this.levels[levelId];
            this.currentLevelId = levelId;
            this.levelTransitionTime = 4000;
        }else{
            if (player.health >= 100 || (player.health < 100 && remainingEnemies == 0)){
                this.level = this.levels[++this.currentLevelId];
                localStorage.setItem(localStorageLevel,this.currentLevelId);
                this.level.player.bombs = player.bombs;
                this.levelTransitionTime = 4000;
                if (player.health < 100 && remainingEnemies == 0){
                    this.level.player.health = 5;
                    game.setPlayerSays("I left previous chapter without full courage so I'm extra scared.",10000);
                }
            }

        }
    }

    isLevelTransition(){
        return this.levelTransitionTime >0;
    }

    tick(game, deltaTime){
        if (this.isLevelTransition()){
            this.levelTransitionTime -= deltaTime;
            return;
        }
        this.level.tick(game, deltaTime);
    }

    render(game){
        if (this.isLevelTransition()) return;
        this.level.render(game);

    }

    renderLight(game){
        if (this.isLevelTransition()) return;
        this.level.renderLight(game);
    }

    renderUI(game){
        this.level.renderUI(game);
    }

    getGlobalDarkness(){
        return this.level.globalDarkness;
    }
}

export default Screen;