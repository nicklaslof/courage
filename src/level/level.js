import Sprite from "../graphic/sprite.js";

class Level{
    constructor(width,height,texture){
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.tiles = [width*height];

        this.floor = new Sprite(0,0,texture);
    }

    tick(deltaTime){

    }

    render(screen){
        for(let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                this.floor.x = x*16;
                this.floor.y = y*16;
                this.floor.render(screen);
            }
        }
    }

}

export default Level;