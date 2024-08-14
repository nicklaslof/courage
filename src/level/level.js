import Player from "../entity/player.js";
import Sprite from "../graphic/sprite.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";

class Level{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.tiles = new Array(64*64);
        this.tiles.fill(Tiles.air);
        this.entities = [];
        this.lights = [];


        this.lights.push(new Light(368,368,0xffffffff,192,192));
        this.lights.push(new Light(540,368,0xffffffff,192,192));

        for (let x = 10; x < 18; x++){
            this.tiles[x+10*this.width] = Tiles.wall1;
            this.tiles[18+10*this.width] = Tiles.wall_rightend;
            this.tiles[9+10*this.width] = Tiles.wall_leftend;
            this.tiles[18+11*this.width] = Tiles.wall_right;
            this.tiles[18+12*this.width] = Tiles.wall_right;
            this.tiles[18+13*this.width] = Tiles.wall_right;
            this.tiles[9+11*this.width] = Tiles.wall_left;
            this.tiles[9+12*this.width] = Tiles.wall_left;
            this.tiles[9+13*this.width] = Tiles.wall_left;
            this.tiles[x+11*this.width] = Tiles.floor1;
            this.tiles[x+12*this.width] = Tiles.floor1;
            this.tiles[x+13*this.width] = Tiles.floor1;

            this.tiles[x+14*this.width] = Tiles.wall_bottom;
        }

        this.tiles[9+14*this.width] = Tiles.wall_bottom_left_corner;
        this.tiles[18+14*this.width] = Tiles.wall_bottom_right_corner;
        

        this.player = new Player(10*32,10*32);
        this.entities.push(this.player);

    }

    tick(game,deltaTime){
        this.entities.forEach(e => e.tick(game,deltaTime));
        this.lights.forEach(l => l.tick(game, deltaTime));
    }

    render(game){
    

        for(let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                
                let tile = this.tiles[x+y*this.width];
                if (tile != null){
                    if (x ==10){
                        console.log("player.x: "+ this.player.x+ " player.sprite.x: " + this.player.sprite.x+ " tile.x "+ x*32 + " tile.renderX:" + ( (game.cameraCenterX - this.player.x) + (x*32)));
                    }
                    tile.sprite.x = (game.cameraCenterX - this.player.x) + (x*32);
                    tile.sprite.y = (game.cameraCenterY - this.player.y) + (y*32);
                    tile.render(game);
                }
            }
        }

        this.entities.forEach(e => e.render(game));
    }

    renderLight(game){
        this.lights.forEach(l => l.render(game));
    }

}

export default Level;