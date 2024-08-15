import Enemy from "../entity/enemy.js";
import Player from "../entity/player.js";
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

        this.lights.push(new Light(736,736,0xff00ffff,360,360));
        this.lights.push(new Light(1080,736,0xff0055ff,360,360));
        this.lights.push(new Light(880,856,0xff0000ff,360,360));

        //Tiles.wall1.sprite.c = 0xff0000ff;

        for (let x = 10; x < 18; x++){
            this.tiles[x+10*this.width] = Tiles.wall1;
            this.tiles[18+10*this.width] = Tiles.wall_rightend;
            this.tiles[9+10*this.width] = Tiles.wall_leftend;
            this.tiles[18+11*this.width] = Tiles.wall_right;
            this.tiles[18+12*this.width] = Tiles.floor1;
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
        

        this.player = new Player(10*64,11*64,48);


        this.entities.push(new Enemy(11*64,11*64));
        this.entities.push(new Enemy(11*64,12*64));
        this.entities.push(new Enemy(13*64,13*64));
        this.entities.push(new Enemy(12*64,11*64));
        this.entities.push(this.player);

    }

    tick(game,deltaTime){
        this.entities.forEach(e => e.tick(game,deltaTime));
        this.lights.forEach(l => l.tick(game, deltaTime));

        // This is ugly an not efficent. Fix if I have time and space.
        this.entities.forEach(e1 => {
            this.entities.forEach(e2 => {
                if ((!e1.disposed || !e2.disposed) && e1.doesCollide(e2)){
                    console.log("Collision");
                    e1.onCollision(e2);
                    if (e1.disposed) this.removeEntity(e1);
                }
            });
        })
    }

    removeEntity(entity){
        this.removeFromList(entity,this.entities);
    }

    removeFromList(object,list){
        for(let i = list.length - 1; i >= 0; i--) {
            if(list[i] === object) {
                list.splice(i, 1);
            }
        }
    }

    render(game){
        for(let x = 0; x < this.width; x++){
            for (let y = 0; y < this.height; y++){
                let tile = this.tiles[x+y*this.width];
                if (tile != null){
                    tile.sprite.x = (game.cameraCenterX - this.player.x) + (x*64);
                    tile.sprite.y = (game.cameraCenterY - this.player.y) + (y*64);
                    tile.render(game);
                }
            }
        }

        this.entities.forEach(e => e.render(game));
    }

    renderLight(game){
        this.lights.forEach(l => l.render(game));
    }

    getTileAndTilePositionAtWorldPosition(x,y){
        x = Math.floor(x/64);
        y = Math.floor(y/64);
        return {tileX:x,tileY:y, tile:this.tiles[x+y*this.width]};
    }

}

export default Level;