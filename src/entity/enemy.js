import Sprite from "../graphic/sprite.js";
import Pickup from "./pickup.js";
import Entity from "./entity.js";

class Enemy extends Entity{
    constructor(x,y,sprite){
        super(x,y,sprite,3,{minX:16,minY:10,maxX:48,maxY:58});


        this.speed = 128;
        this.health = 1;
        
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.idle) return;
        this.moveAgainstPlayer(game);
    }

    

    onDeath(game){
        for (let i = 0; i < 32;i++){
            game.screen.level.addParticle(this.x,this.y+this.pixelScale,0x990000ff,game.getRandom(1,12),game.getRandom(1,12),1500,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},game.getRandom(50,120));
        }
        game.screen.level.addLight(this.x,this.y,0xff00ffff,48,48,100,false);
        if (Math.random()< 0.4){
            game.screen.level.addEntity(new Pickup(this.x,this.y,game.getRandom(-1,1),"c"));
        }
        
    }

    onHit(game){
        if (this.health>0){
            //game.playEnemyHit();
            for (let i = 0; i < 4;i++){
                game.screen.level.addParticle(this.x,this.y+this.pixelScale,0x990000ff,game.getRandom(1,4),game.getRandom(1,4),600,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},100);
            }
        }
    }

    render(game){
        super.render(game);
    }

}
export default Enemy;