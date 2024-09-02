import Sprite from "../graphic/sprite.js";

class Light{

    constructor(x,y,c,sizeX=550,sizeY=550,ttl=10000,flicker=false) {
        this.x = x;
        this.y = y;
        this.ttl = ttl; // if light has a ttl more than 10 seconds it will light forever
        this.disposed = false;
        this.renderOffsetX = 0;
        this.renderOffsetY = 0;
        this.flicker = flicker;
        this.flickerCounter = Math.random()*1000;
        this.sprite = new Sprite(x,y,128,200,550,500,sizeX,sizeY,c);
    }
    tick(game, deltaTime){
        if (this.ttl < 10000){
            this.ttl -= deltaTime;
        }

        if (this.ttl <= 0) this.disposed = true;
        
        if (this.flicker){
            this.flickerCounter += deltaTime;
            let s = Math.sin(this.flickerCounter/120);
            this.sprite.sizeX += (s/2)*(deltaTime/2);
            this.sprite.sizeY += (s/2)*(deltaTime/2);
        }

        this.sprite.sizeX = Math.max(0,this.sprite.sizeX);
        this.sprite.sizeY = Math.max(0,this.sprite.sizeY);
        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x + this.renderOffsetX;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y + this.renderOffsetY;
        this.sprite.tick();
    }

    render(game){
        this.sprite.render(game);
    }

}
export default Light;