import Particle from "../entity/particle.js";
import Player from "../entity/player.js";
import Sprite from "../graphic/sprite.js";
import Light from "../light/light.js";
import Tiles from "../tile/tiles.js";
import Room from "./room.js";
import Enemy from "../entity/enemy.js";

class Level{
    constructor(game,width,height,chapter,name,wallColor,floorColor,mobSpawns,mobSpawnChance,globalDarkness,torches,minRoomSize,maxRoomSize,numberOfRooms,lava,battleRoom,bossLevel){
        this.width = width;
        this.height = height;
        this.chapter = chapter;
        this.wallColor = wallColor;
        this.floorColor = floorColor;
        this.mobSpawns = mobSpawns;
        this.mobSpawnChance = mobSpawnChance;
        this.name = name;
        this.tiles = new Array(this.width*this.height);
        this.tileRoom = new Array(this.width*this.height);
        this.globalDarkness = globalDarkness;
        this.torches = torches;
        this.minRoomSize = minRoomSize;
        this.maxRoomSize = maxRoomSize;
        this.numberOfRooms = numberOfRooms;
        this.lava = lava;
        this.battleRoom = battleRoom;
        this.bossLevel = bossLevel;
        this.boss = null;

        this.allRoomsCreated = false;
        this.started = false;

        this.entities = [];

        this.lights = [];
        this.particles = [];
        this.decorations = [];
        this.rooms = [];



        this.allRoomsCreated = this.generateRooms(game);
        let startRoom = null;

        if (bossLevel) startRoom = this.rooms[0];
        else{
            for (let i = 0; i < this.rooms.length;i++){
                startRoom = this.rooms.sort(function(a,b){ return a.width*a.height - b.width*b.height})[i];
                if (!startRoom.lastRoom && !startRoom.lava && !startRoom.battleRoom) break;
            }
        }

        startRoom.removeAllEnemies(this);
        this.player = new Player(game,(startRoom.x+2)*64,(startRoom.y+2)*64,48);
        this.entities.push(this.player);

        if (bossLevel) this.player.health = 100;

        if (this.floorColor == 0x22ffffff){
            this.stars = new Sprite(W/2,H/2,768,768,1600,1600,W*6,H*6,0xffffffff);
            this.playerStartX = this.player.x-4000;
            this.playerStartY = this.player.y-4000;
        }
    }

    generateRooms(game) {
        let rp = this.generateRoomProperties(game, this.maxRoomSize, this.maxRoomSize);
        rp.x = this.width / 2;
        rp.y = this.height / 2;

        let newRoom = new Room(rp.x, rp.y, rp.width, rp.height);
        let previousRoom = null, previousDirection = null;
        let numberOfRoomsCreated = 0;
        for (let i = 0; i < this.numberOfRooms; i++) {
            let lastRoom = i == this.numberOfRooms-1; //Let the room know it's the last room generated since that room will contain the exit stairs.
            this.rooms.push(newRoom);
            newRoom.generateRoom(this,game, rp.x, rp.y, rp.width, rp.height, this.floorColor, this.wallColor,i == 0, lastRoom,this.lava,this.battleRoom,this.bossLevel&&!lastRoom&&i!=0,this.bossLevel);
            // Generate a corridor connection to the previous generated room. It handles all four directions and will scan
            // the previous generated room horizontal or vertical depending on the direction. It will record all possible paths
            // found that would connect the two rooms and picks two of those paths randomly and then just insert floor tiles
            // into the tilemap overwriting the walls. It looks a bit ugly and can possibly be fixed with correct tile replacement.

            if (previousRoom) {
                let possiblePaths = [];
                switch (previousDirection) {
                    case 0:{
                        let [sx,sy] = [previousRoom.x +2,previousRoom.y];
                        for (let x = sx;x < sx+previousRoom.width-2;x++){
                            let pathFound = false;
                            length = 0;
                            for (let y = sy-1; y > sy-5;y--){
                                length++;
                                if (this.getTile(x,y) == Tiles.floor1){
                                    pathFound = true;
                                    break;
                                }
                            }
                            if (pathFound) possiblePaths.push(x);
                        }

                       let px = possiblePaths[Math.floor(game.getRandom(0,possiblePaths.length-1))];
                       for (let y = sy; y > sy-length;y--){
                            this.addTile(px,y,Tiles.floor1);
                        }
                        break;
                    }
                    case 1:{
                        let [sx,sy] = [previousRoom.x +2,previousRoom.y+previousRoom.height];
                        for (let x = sx;x < sx+previousRoom.width-2;x++){
                            let pathFound = false;
                            length = 0;
                            for (let y = sy; y < sy+5;y++){
                                length++;
                                if (this.getTile(x,y) == Tiles.floor1){
                                    pathFound = true;
                                    break;
                                }
                            }
                            if (pathFound) possiblePaths.push(x);
                        }
                       let px = possiblePaths[Math.floor(game.getRandom(0,possiblePaths.length-1))];
                       for (let y = sy-1; y < sy+length;y++){
                            this.addTile(px,y,Tiles.floor1);
                        }
                        break;
                    }
                    case 2:{
                        let [sx,sy] = [previousRoom.x + previousRoom.width,previousRoom.y+1];
                        for (let y = sy;y < sy+previousRoom.height-2;y++){
                            let pathFound = false;
                            length = 0;
                            for (let x = sx; x < sx+5;x++){
                                length++;
                                if (this.getTile(x,y) == Tiles.floor1){
                                    pathFound = true;
                                    break;
                                }
                            }
                            if (pathFound) possiblePaths.push(y);
                        }
                       let py = possiblePaths[Math.floor(game.getRandom(0,possiblePaths.length-1))];
                       for (let x = sx-1; x < sx+length;x++){
                            this.addTile(x,py,Tiles.floor1);
                        }
                        break;
                    }
                    case 3:{
                        let [sx,sy] = [previousRoom.x,previousRoom.y+1];
                        for (let y = sy;y < sy+previousRoom.height-2;y++){
                            let pathFound = false;
                            length = 0;
                            for (let x = sx; x > sx-5;x--){
                                length++;
                                if (this.getTile(x,y) == Tiles.floor1){
                                    pathFound = true;
                                    break;
                                }
                            }
                            if (pathFound) possiblePaths.push(y);
                        }
                       let py = possiblePaths[Math.floor(game.getRandom(0,possiblePaths.length-1))];
                       for (let x = sx; x > sx-length;x--){
                            this.addTile(x,py,Tiles.floor1);
                        }
                        break;
                    }
                }
            }

            

            previousRoom = newRoom;
            let roomCreated = false;
            let loopMaxCounter = 0;
            while (!roomCreated) {
                loopMaxCounter++;
                // create a new room in a random direction from the current room
                // it will do a AABB intersection test to see if a room will overlap with an exisiting room
                // if it fails after 30 tries the level will be marked as failed and a new one will be created.
                // This is to minimize the risk of an eternal loop and a broken level. It still only takes a few milliseconds to generate all levels so
                // a retry is not a big cost.

                if (loopMaxCounter > 30) break;
                let nextDirection = Math.floor(game.getRandom(0, 4));
                rp = this.generateRoomProperties(game, this.maxRoomSize, this.maxRoomSize);

                let [roomDistance, roomLocationVariation] = [Math.floor(game.getRandom(1, 3)), Math.floor(game.getRandom(-3,3))];
                switch (nextDirection) {
                    case 0:
                        [rp.x, rp.y] = [previousRoom.x + roomLocationVariation, previousRoom.y - roomDistance - rp.height];
                        break;
                    case 1:
                        [rp.x, rp.y] = [previousRoom.x + roomLocationVariation, previousRoom.y + previousRoom.height + roomDistance];
                        break;
                    case 2:
                        [rp.x, rp.y] = [previousRoom.x + previousRoom.width + roomDistance, previousRoom.y - roomLocationVariation];
                        break;
                    case 3:
                        [rp.x, rp.y] = [previousRoom.x - roomDistance - rp.width, previousRoom.y - roomLocationVariation];
                        break;
                }

                newRoom = new Room(rp.x, rp.y, rp.width, rp.height);
                // Do an AABB intersect test for each room so the new room doesn't overlap. If it fails after 30 tries the level will be marked incomplete and a new one will be created.
                roomCreated = this.rooms.every(room => !room.intersect(newRoom));
                previousDirection = nextDirection;
            }
            if (!roomCreated) break;
            numberOfRoomsCreated++;
        }
        return (numberOfRoomsCreated == this.numberOfRooms);
    }

    generateRoomProperties(game,maxWidth,maxHeight){
        return {
            x : 0,
            y : 0,
            width : Math.floor(game.getRandom(this.minRoomSize,maxWidth)),
            height : Math.floor(game.getRandom(this.minRoomSize,maxHeight)),
        }
    }

    tick(game,deltaTime){
        this.started = true;
        this.player.tick(game,deltaTime);
        this.entities.forEach(e => { if (!(e instanceof Player)) e.tick(game,deltaTime)});
        this.lights.forEach(l => {
            l.tick(game, deltaTime);
            if (l.disposed) this.removeLight(l);
        });

        // This is ugly and not efficent. Fix if I have time and space.
        this.entities.filter(e => !e.idle).forEach(e1 => {
            this.entities.filter(e => !e.idle).forEach(e2 => {
                if ((!e1.disposed || !e2.disposed) && e1.doesCollide(e2)){
                    e1.onCollision(game,e2);
                }
                if (e1.disposed) this.removeEntity(e1);
            });
        })

        this.particles.forEach(p => {
            p.tick(game,deltaTime);
            if (p.disposed) this.removeParticle(p);
        });

        this.decorations.forEach(d => d.tick(game,deltaTime));



        if (this.stars != null){
            this.stars.tick(game,deltaTime);
            this.stars.x = W/2 + (this.playerStartX - this.player.x)/5;
            this.stars.y = H/2 + (this.playerStartY - this.player.y)/5;
        }
        if (this.player.health < 1) game.switchToGameOver();
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    addDecoration(decoration){
        this.decorations.push(decoration);
    }

    addParticle(x,y,c,sizeX, sizeY, ttl,moveDirection,speed){
        this.particles.push(new Particle(x,y,0,64,7,7,sizeX,sizeY,c,ttl,moveDirection,speed));
    }

    // Add a new light to the scene and return it.
    addLight(x,y,c,sizeX,sizeY,ttl,flicker=false){
        let l = new Light(x,y,c,sizeX,sizeY,ttl,flicker);
        this.lights.push(l);
        return l;
    }

    removeLight(light){
        this.removeFromList(light,this.lights);
    }

    removeParticle(particle){
        this.removeFromList(particle,this.particles);
    }

    addTile(x,y,tile,room=null){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return;
        this.tiles[x + y * this.width] = tile;
        if (room !=null) this.tileRoom[x + y * this.width] = room;
    }

    getTile(x,y){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return null;
        return this.tiles[x+y*this.width];
    }

    getTileRoom(x,y){
        if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1) return null;
        return this.tileRoom[x+y*this.width];
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

    getRemainingEnemies(){
        return this.entities.filter(e => e instanceof Enemy).length;
    }

    render(game){
        if (this.floorColor == 0x22ffffff){
            this.stars.render(game);
            
        }
        // Render tiles around the player
        for(let x = Math.floor((this.player.x -W)/64); x < Math.floor((this.player.x + W)/64); x++){
            for (let y = Math.floor((this.player.y -H)/64); y < Math.floor((this.player.y + H)/64); y++){
                let tile = this.tiles[x+y*this.width];
                let tileRoom = this.tileRoom[x+y*this.width];
                if (tile != null){
                    tile.sprite.x = (game.cameraCenterX - this.player.x) + (x*64);
                    tile.sprite.y = (game.cameraCenterY - this.player.y) + (y*64);
                    if (tileRoom != null){
                        if (tile == Tiles.floor1) tile.c = tileRoom.getFloorColor();
                        else if (tile == Tiles.lava) tile.c = Tiles.lava.c;
                        else tile.c = tileRoom.getWallColor();
                    }
                    tile.render(game);
                }
            }
        }

        this.decorations.forEach(d => d.render(game));

        this.entities.forEach(e => {if (!e.idle) e.render(game)});
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