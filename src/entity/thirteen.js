import Sprite from "../graphic/sprite.js";
import Bullet from "./bullet.js";
import Enemy from "./enemy.js";

class Thirteen extends Enemy{
    constructor(game,x,y,c,speed,size){
        super(game,x,y,Math.random()< 0.5?new Sprite(x,y,16,48,3,6,32,32,0xffffffff):new Sprite(x,y,20,48,3,6,32,32,0xffffffff));

        this.shootDelay = 0;
        this.health = 2+game.getGamerule().mobHealthExtra;
        this.speed = speed;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        if (this.shootDelay > 0) this.shootDelay -=deltaTime;
        else{
            let player = game.screen.level.player;
            this.calculatePlayerDirectionVector.x = player.x - this.x;
            this.calculatePlayerDirectionVector.y = player.y - this.y;
            if (game.length(this.calculatePlayerDirectionVector) < 350 && game.canEntitySee(game.screen.level,player.x,player.y,this.x,this.y)) {
                this.normalize(this.calculatePlayerDirectionVector);
                let b = new Bullet(game,this.x+18,this.y+16,game.getRandom(1000,4000),80, this.calculatePlayerDirectionVector.x, this.calculatePlayerDirectionVector.y,this,0xff00ff00,null,false,Math.random()< 0.5?new Sprite(this.x,this.y,16,48,3,6,16,16,0xff00ffff):new Sprite(this.x,this.y,20,48,3,6,16,16,0xff00ffff))
                b.onTick = (e,deltaTime) => {
                    if (e.timer == null) e.timer = Math.random();
                    e.timer += deltaTime/100;
                    let s = Math.sin(e.timer);
                    let c = Math.cos(e.timer);
                    e.x += s/4;
                    e.y += c/4;
                }
                game.screen.level.addEntity(b);
            }
            this.shootDelay = 400;
        }

        this.horizontalFlip = true;
    }
}

export default Thirteen;