import Sprite from "../graphic/sprite.js";
import Pickup from "./pickup.js";
import Entity from "./entity.js";
import Decoration from "./decoration.js";
class Box extends Entity{
    constructor(game,x,y){
        super(game,x,y,new Sprite(x,y,0,48,12,11,32,32,0xffffffff),5,{minX:0,minY:0,maxX:32,maxY:28});
        this.hitDelay = 200;
        this.treasureBox = Math.random()< 0.1 ? true:false;
        this.health = this.treasureBox ? 5 : 2;
    }

    onHit(game){
        game.playBoxHit();
        for (let i = 0; i < 4;i++){
            let size = game.getRandom(5,10)
            game.screen.level.addParticle(this.x,this.y,0xff5777ad,size,size,600,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},100);
        }
        if (this.treasureBox) game.screen.level.addEntity(new Pickup(game,this.x,this.y,game.getRandom(-1,1),Math.random()<0.5?"c":"b"));
    }

    onDeath(game){
        game.playBoxExplosion();
        for (let i = 0; i < 12;i++){
            let size = game.getRandom(12,15)
            game.screen.level.addParticle(this.x+16,this.y+16,0xff5777ad,size,size,1200,{x:game.getRandom(-0.2,0.2),y:game.getRandom(-0.2,-0.1)},100);
        }
        if (!this.treasureBox && Math.random()<0.4) game.screen.level.addEntity(new Pickup(game,this.x,this.y,game.getRandom(-1,1),Math.random()<0.9/game.getGamerule().bombDropChance?"c":"b"));
        for (let i = 0;i< 10;i++){
            game.screen.level.addDecoration(new Decoration(game.screen.level,this.x+Math.random()*32,this.y+Math.random()*32,0,0,"b"));
        }
        
    }
}
export default Box;