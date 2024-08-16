import Bullet from "../entity/bullet.js";
import Enemy from "../entity/enemy.js";
import Player from "../entity/player.js";
import Sprite from "../graphic/sprite.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";

class Level{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.tiles = new Array(this.width*this.height);

        this.entities = [];
        this.lights = [];

        //Tiles.wall1.sprite.c = 0xff0000ff;

        /*for (let x = 10; x < 64; x++){
            this.addTile(x,10,Tiles.wall1);
            this.addTile(18,10,Tiles.wall_rightend);
            this.addTile(9,10,Tiles.wall_leftend);
            this.addTile(18,11,Tiles.wall_right);
            this.addTile(18,12,Tiles.floor1);
            this.addTile(18,13,Tiles.wall_right);
            this.addTile(9,11,Tiles.wall_left);
            this.addTile(9,12,Tiles.wall_left);
            this.addTile(9,13,Tiles.wall_left);
            this.addTile(x,11,Tiles.floor1);
            this.addTile(x,12,Tiles.floor1);
            this.addTile(x,13,Tiles.floor1);

            this.addTile(x,14,Tiles.wall_bottom);
        }

        this.addTile(9,14,Tiles.wall_bottom_left_corner);
        this.addTile(18,14,Tiles.wall_bottom_right_corner);*/

        for (let x = 1; x < 63;x++){
            for (let y = 1; y < 63;y++){
                this.addTile(x,y,Tiles.floor1);
                if (Math.random() < 0.1){
                    this.addLight(x*64,y*64,Math.random()*Number.MAX_SAFE_INTEGER,320,320,10000);
                }

                if (Math.random() < 0.08){
                    this.entities.push(new Enemy(x*64,y*64));
                }
            }
        }
        

        this.player = new Player(72,72,48);

        //this.addLight(72,72,0xffffffff,320,320,100);

        //this.entities.push(new Enemy(128,128));


        /*this.entities.push(new Enemy(11*64,11*64));
        this.entities.push(new Enemy(11*64,12*64));
        this.entities.push(new Enemy(13*64,13*64));
        this.entities.push(new Enemy(12*64,11*64));*/

        //this.entities.push(new Bullet(14*64,12*64,2000));
        this.entities.push(this.player);

    }

    tick(game,deltaTime){
        this.entities.forEach(e => e.tick(game,deltaTime));
        this.lights.forEach(l => {
            l.tick(game, deltaTime);
            if (l.disposed) this.removeLight(l);
        });

        // This is ugly an not efficent. Fix if I have time and space.
        this.entities.forEach(e1 => {
            this.entities.forEach(e2 => {
                if ((!e1.disposed || !e2.disposed) && e1.doesCollide(e2)){
                    //console.log("Collision");
                    e1.onCollision(game,e2);
                }
                if (e1.disposed) this.removeEntity(e1);
            });
        })
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    // Add a new light to the scene and return it.
    addLight(x,y,c,sizeX,sizeY,ttl){
        let l = new Light(x,y,c,sizeX,sizeY,ttl);
        this.lights.push(l);
        return l;
    }

    removeLight(light){
        console.log("removing light "+light);
        this.removeFromList(light,this.lights);
    }

    addTile(x,y,tile){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return;
        this.tiles[x + y * this.width] = tile;
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

    renderUI(game){
        this.player.renderUI(game);
    }

    getTileAndTilePositionAtWorldPosition(x,y){
        x = Math.floor(x/64);
        y = Math.floor(y/64);
        return {tileX:x,tileY:y, tile:this.tiles[x+y*this.width]};
    }

}

export default Level;