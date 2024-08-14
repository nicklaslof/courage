import Sprite from "../graphic/sprite.js";

class Level{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.tiles = [width*height];

        this.floor = new Sprite(0,0,0,0,16,16,32,32,0xffffffff);
        this.floor2 = new Sprite(0,0,0,16,16,16,32,32,0xffffffff);
        this.entities = [];

        this.scrollX = 0;
        this.scrollY = 0;
    }

    tick(deltaTime){
        this.entities.forEach(e => e.tick(deltaTime));
        this.scrollX -= deltaTime/1000;
        this.scrollY -= deltaTime/1000;
    }

    render(game){
        this.entities.forEach(e => e.render(this));

        for(let x = 0 + this.scrollX; x < this.width; x++){
            for (let y = 0 + this.scrollY; y < this.height; y++){
                this.floor.x = x*32;
                this.floor.y = y*32;
                this.floor.render(game);
            }
        }
            
    }

}

export default Level;