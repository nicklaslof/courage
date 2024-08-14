import Sprite from "../graphic/sprite.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";

class Level{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.tiles = new Array(64*64);
        this.entities = [];
        this.lights = [];


        this.lights.push(new Light(368,368,0xffffffff,256,256));

        for (let x = 10; x < 18; x++){
            this.tiles[x+10*this.width] = Tiles.wall1;
            this.tiles[x+11*this.width] = Tiles.floor1;
            this.tiles[x+12*this.width] = Tiles.floor1;
            this.tiles[x+13*this.width] = Tiles.floor1;
        }

    }

    tick(deltaTime){
        this.entities.forEach(e => e.tick(deltaTime));
        this.lights.forEach(l => l.tick(deltaTime));
    }

    render(game){
        this.entities.forEach(e => e.render(this));

        for(let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                
                let tile = this.tiles[x+y*this.width];
                if (tile != null){
                    console.log(x+" "+y);
                    tile.sprite.x = x*32;
                    tile.sprite.y = y*32;
                    tile.render(game);
                }else{
                    //this.floor.x = x*32;
                    //this.floor.y = y*32;
                    //this.floor.render(game);   
                }
                


            }
        }
        
        

    }

    renderLight(game){
        this.lights.forEach(l => l.render(game));
    }

}

export default Level;