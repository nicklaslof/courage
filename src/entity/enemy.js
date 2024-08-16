import Sprite from "../graphic/sprite.js";
import Entity from "./entity.js";

class Enemy extends Entity{
    constructor(x,y){
        super(x,y,new Sprite(x,y,0,112,16,16,48,48,0xffffffff),3,{minX:16,minY:10,maxX:48,maxY:58});
        this.calculatePlayerDirectionVector = {x:0, y:0};

        this.speed = 112;
        this.health = 3;
        
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.moveAgainstPlayer(game);
    }

    moveAgainstPlayer(game) {
        let player = game.screen.level.player;
        this.calculatePlayerDirectionVector.x = player.x - this.x;
        this.calculatePlayerDirectionVector.y = player.y - this.y;

        if (this.length(this.calculatePlayerDirectionVector) < 512) {
            this.normalize(this.calculatePlayerDirectionVector);
            this.moveDirection.x = this.calculatePlayerDirectionVector.x;
            this.moveDirection.y = this.calculatePlayerDirectionVector.y;
        } else {
            this.moveDirection.x = this.moveDirection.y = 0;
        }
    }

    onDeath(game){
        game.playEnemyKilled();
        for (let i = 0; i < 32;i++){
            game.screen.level.addParticle(this.x,this.y+this.pixelScale,0x990000ff,game.getRandom(1,12),game.getRandom(1,12),1500,{x:game.getRandom(-0.5,0.5),y:game.getRandom(-0.7,-0.3)},100);
        }
        
    }

    onHit(game){
        if (this.health>0){
            game.playEnemyHit();
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