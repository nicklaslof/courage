import Sprite from "../graphic/sprite.js";
import Courage from "./courage.js";
import Entity from "./entity.js";
class Box extends Entity{
    constructor(x,y){
        super(x,y,new Sprite(x,y,0,48,12,11,32,32,0xffffffff),5,{minX:0,minY:0,maxX:24,maxY:42});
        this.hitDelay = 200;
        this.treasureBox = Math.random()< 0.05 ? true:false;
        this.health = this.treasureBox ? 5 : 2;
    }

    onHit(game){
        game.playBoxHit();
        for (let i = 0; i < 4;i++){
            let size = game.getRandom(5,10)
            game.screen.level.addParticle(this.x,this.y,0xff5777ad,size,size,600,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},100);
        }
        if (this.treasureBox) game.screen.level.addEntity(new Courage(this.x,this.y,game.getRandom(-1,1)));
    }

    onDeath(game){
        game.playBoxExplosion();
        for (let i = 0; i < 12;i++){
            let size = game.getRandom(12,15)
            game.screen.level.addParticle(this.x,this.y,0xff5777ad,size,size,1200,{x:game.getRandom(-0.2,0.2),y:game.getRandom(-0.2,-0.1)},100);
        }
        if (!this.treasureBox && Math.random()<0.4) game.screen.level.addEntity(new Courage(this.x,this.y,game.getRandom(-1,1)));
    }
}
export default Box;