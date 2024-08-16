import Sprite from "../graphic/sprite.js";

class Particle{
    constructor(x,y,texX,texY,texW,texH,sizeX,sizeY,c,ttl,moveDirection,speed){
        this.x = x;
        this.y = y;
        this.c = c;
        this.ttl = ttl;
        this.sprite = new Sprite(x,y,texX,texY,texW,texH,sizeX,sizeY,c);
        this.moveDirection = moveDirection;
        this.speed = speed;
        this.disposed = false;

    }

    tick(game,deltaTime){
        if (this.ttl >0) this.ttl -= deltaTime;
        else this.disposed = true;

        this.sprite.sizeX -= deltaTime/500;
        this.sprite.sizeY -= deltaTime/500;

        this.x += this.moveDirection.x * this.speed * deltaTime/1000;
        this.y += this.moveDirection.y * this.speed * deltaTime/1000;

        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y;
        this.sprite.tick();
    }

    render(game){
        this.sprite.render(game);
    }


}

export default Particle;