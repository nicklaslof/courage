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
        let roomMargin = 0;
        let rp = this.generateRoomProperties(game, roomMargin, 15, 15);
        rp.x = this.width / 2;
        rp.y = this.height / 2;

        let newRoom = new Room(this, roomMargin, rp.x, rp.y, rp.width, rp.height);
        let previousRoom = null, previousDirection = null;

        for (let i = 0; i < 6; i++) {
            this.rooms.push(newRoom);
            newRoom.generateRoom(this, rp.x, rp.y, rp.width, rp.height, rp.floorColor, rp.wallColor);
            // Generate a corridor connection to the previous generated room. It handles all four directions and will scan
            // the previous generate room horizontal or vertical depending on the direction. It will record all possible paths
            // found that would connect the two rooms and picks one of those paths randomly and then just insert a floor tile
            // into the tilemap overwriting the walls. It looks a bit ugly and can possibly be fixed with correct tile replacement.
            if (previousRoom) {
                let possiblePaths = [], isHorizontal = previousDirection < 2,
                    dir = [
                        { dx: 0, dy: -1, sx: 2, sy: 0, ex: previousRoom.width - 2, ey: 0, offsetX: 0, offsetY: 0 },
                        { dx: 0, dy: 1, sx: 2, sy: previousRoom.height, ex: previousRoom.width - 2, ey: 0, offsetX: 0, offsetY: -1 },
                        { dx: 1, dy: 0, sx: previousRoom.width, sy: 1, ex: 0, ey: previousRoom.height - 2, offsetX: -1, offsetY: 0 },
                        { dx: -1, dy: 0, sx: 0, sy: 1, ex: 0, ey: previousRoom.height - 2, offsetX: 0, offsetY: 0 }
                    ][previousDirection],
                    [sx, sy] = [previousRoom.x + dir.sx, previousRoom.y + dir.sy];
            
                let findPath = (x, y, dx, dy) => {
                    for (let i = 0; i < 5; i++) {
                        this.addLight((x + i * dx) * 64, (y + i * dy) * 64, 0xff0000ff, 32, 32, 10000);
                        if (this.getTile(x + i * dx, y + i * dy) == Tiles.floor1) {
                            this.addLight((x + i * dx) * 64, (y + i * dy) * 64, 0xff00ff00, 32, 32, 10000);
                            return { pathFound: true, length: i + 1 };
                        }
                    }
                    return { pathFound: false, length: 5 };
                };
            
                for (let i = 0; i < dir.ex + dir.ey; i++) {
                    const { pathFound } = findPath(isHorizontal ? sx + i : sx, isHorizontal ? sy : sy + i, dir.dx, dir.dy);
                    if (pathFound) possiblePaths.push(isHorizontal ? sx + i : sy + i);
                }
            
                let p = possiblePaths[Math.floor(game.getRandom(0, possiblePaths.length - 1))],
                    { length } = findPath(isHorizontal ? p : sx, isHorizontal ? sy : p, dir.dx, dir.dy);
            
                for (let i = 0; i < length; i++) {
                    this.addTile(isHorizontal ? p : sx + i * dir.dx + dir.offsetX, isHorizontal ? sy + i * dir.dy + dir.offsetY : p, Tiles.floor1);
                }
            }
            

            previousRoom = newRoom;
            let roomCreated = false;

            while (!roomCreated) {
                let nextDirection = Math.floor(game.getRandom(0, 4));
                rp = this.generateRoomProperties(game, roomMargin, 15, 15);

                let [roomDistance, roomLocationVariation] = [Math.floor(game.getRandom(1, 3)), Math.floor(game.getRandom(-3,3))];
                switch (nextDirection) {
                    case 0:
                        [rp.x, rp.y] = [previousRoom.x + roomLocationVariation, previousRoom.y - roomMargin - roomDistance - rp.height];
                        break;
                    case 1:
                        [rp.x, rp.y] = [previousRoom.x + roomLocationVariation, previousRoom.y + roomMargin + previousRoom.height + roomDistance];
                        break;
                    case 2:
                        [rp.x, rp.y] = [previousRoom.x + roomMargin + previousRoom.width + roomDistance, previousRoom.y - roomLocationVariation];
                        break;
                    case 3:
                        [rp.x, rp.y] = [previousRoom.x - roomMargin - roomDistance - rp.width, previousRoom.y - roomLocationVariation];
                        break;
                }

                newRoom = new Room(this, roomMargin, rp.x, rp.y, rp.width, rp.height);
                roomCreated = this.rooms.every(room => !room.intersect(newRoom));
                previousDirection = nextDirection;
            }
        }
    }

    generateRoomProperties(game, roomMargin,maxWidth,maxHeight){
        return {
            x : 0,
            y : 0,
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

    getTile(x,y){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return null;
        return this.tiles[x+y*this.width];
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