import Particle from "../entity/particle.js";
import Player from "../entity/player.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";
import Room from "./room.js";

class Level{
    constructor(game,width,height){
        this.width = width;
        this.height = height;
        this.tiles = new Array(this.width*this.height);
        this.tileOwner = new Array(this.width*this.height);

        this.entities = [];
        this.lights = [];
        this.particles = [];
        this.rooms = [];

        this.generateRooms(game);

        let startRoom = this.rooms[Math.floor(game.getRandom(0,this.rooms.length-1))];
        this.player = new Player((startRoom.x+2)*64,(startRoom.y+2)*64,48);
        this.entities.push(this.player);
    }

    generateRooms(game) {
        const roomMargin = 2;
        for (let i = 0; i < 15; i++) {
            let rp = this.generateRoomProperties(game, roomMargin, 20, 20);
            let room = new Room(this, roomMargin, rp.x, rp.y, rp.width, rp.height);
            
            while (!this.rooms.every(r => !r.intersect(room)) || this.roomTooBig(rp)) {
                rp = this.generateRoomProperties(game, roomMargin, 
                    this.roomTooBig(rp) ? rp.width - 1 : rp.width, 
                    this.roomTooBig(rp) ? rp.height - 1 : rp.height
                );
                room = new Room(this, roomMargin, rp.x, rp.y, rp.width, rp.height);
            }
            
            this.rooms.push(room);
            room.generateRoom(this, rp.x, rp.y, rp.width, rp.height, rp.floorColor, rp.wallColor);
        }
    }

    roomTooBig(rp){
        return (rp.x + rp.width > this.width-1 || rp.y + rp.height > this.height-1);
    }

    generateRoomProperties(game, roomMargin,maxWidth,maxHeight){
        return {
            x : Math.floor(game.getRandom(roomMargin,this.width-roomMargin)),
            y : Math.floor(game.getRandom(roomMargin,this.height-roomMargin)),
            width : Math.floor(game.getRandom(8,maxWidth)),
            height : Math.floor(game.getRandom(8,maxHeight)),
            floorColor : 0xffcccccc,
            wallColor : 0xff999999,
        }
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

        this.particles.forEach(p => {
            p.tick(game,deltaTime);
            if (p.disposed) this.removeParticle(p);
        });
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    addParticle(x,y,c,sizeX, sizeY, ttl,moveDirection,speed){
        this.particles.push(new Particle(x,y,0,64,7,7,sizeX,sizeY,c,ttl,moveDirection,speed));
    }

    // Add a new light to the scene and return it.
    addLight(x,y,c,sizeX,sizeY,ttl){
        let l = new Light(x,y,c,sizeX,sizeY,ttl);
        this.lights.push(l);
        return l;
    }

    removeLight(light){
        this.removeFromList(light,this.lights);
    }

    removeParticle(particle){
        this.removeFromList(particle,this.particles);
    }

    addTile(x,y,tile,owner=null){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return;
        this.tiles[x + y * this.width] = tile;
        if (owner !=null) this.tileOwner[x + y * this.width] = owner;
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
                let owner = this.tileOwner[x+y*this.width];
                if (tile != null){
                    tile.sprite.x = (game.cameraCenterX - this.player.x) + (x*64);
                    tile.sprite.y = (game.cameraCenterY - this.player.y) + (y*64);
                    if (owner != null){
                        if (tile == Tiles.floor1) tile.c = owner.getFloorColor();
                        else tile.c = owner.getWallColor();
                    }
                    tile.render(game);
                }
            }
        }

        this.entities.forEach(e => e.render(game));
        this.particles.forEach(p => p.render(game));
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