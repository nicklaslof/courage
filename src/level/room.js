import Tiles from "../tile/tiles.js";
import Enemy from "../entity/enemy.js";
import Mobspawner from "../entity/mobspawner.js";

class Room{
    static id = 0;
    constructor(roomMargin, startTileX, startTileY, width, height){
        this.AABB = {minX:startTileX-roomMargin,minY:startTileY-roomMargin,maxX:startTileX+width+roomMargin,maxY:startTileY+height+roomMargin};
        //Debug
        /*console.log("Room size: "+width +" x "+ height);
        console.log("startTileX "+startTileX+ " startTileY "+startTileY);
        console.log("endTileX " + (startTileX+width) + " endTileY "+(startTileY+height));
        console.log(this.AABB);
        console.log("---------------------");*/
    }

    generateRoom(level, startTileX, startTileY, width, height, floorColor=0xffffffff, wallColor=0xffffffff){
        this.floorColor = floorColor;
        this.wallColor = wallColor;
        this.x = startTileX;
        this.y = startTileY;
        this.width = width;
        this.height = height;
        this.mobSpawners = [];
        this.initialMobSpawnerPlaced = false;

        for (let x = startTileX; x < startTileX+width; x++){
            for (let y = startTileY; y < startTileY+height; y++){
                if (y == startTileY && x > startTileX && x < startTileX+width-1) level.addTile(x,y,Tiles.wall1,this);
                else if (x == startTileX && y == startTileY) level.addTile(x,y,Tiles.wall_leftend,this);
                else if (x == startTileX+width-1 && y == startTileY) level.addTile(x,y,Tiles.wall_rightend,this);
                else if (x == startTileX && y < startTileY+height-1) level.addTile(x,y,Tiles.wall_left,this);
                else if (x == startTileX+width-1 && y < startTileY + height-1) level.addTile(x,y,Tiles.wall_right,this);
                else if (y == startTileY+height-1 && x > startTileX && x < startTileX+width-1) level.addTile(x,y,Tiles.wall_bottom,this);
                else if (x == startTileX && y == startTileY+height-1) level.addTile(x,y,Tiles.wall_bottom_left_corner,this);
                else if (x == startTileX+width-1 && y == startTileY+height-1) level.addTile(x,y,Tiles.wall_bottom_right_corner,this);
                else level.addTile(x,y,Tiles.floor1,this);

                if (Math.random() < 0.1){
                    let size = 200+Math.random()*320;
                    level.addLight(x*64,y*64,Math.random()*Number.MAX_SAFE_INTEGER,size,size,10000);
                }

                if (Math.random()< 0.09 && level.getTile(x,y) == Tiles.floor1){
                    this.mobSpawners.push(new Mobspawner(x,y,[Enemy],6,!this.initialMobSpawnerPlaced?2000:null));
                    this.initialMobSpawnerPlaced = true;
                }
                
            }
        }
        Room.id++;
        this.roomId = Room.id;
    }

    intersect(otherRoom){
        return (otherRoom.AABB.minX <= this.AABB.maxX && otherRoom.AABB.maxX >= this.AABB.minX)&&
        (otherRoom.AABB.minY <= this.AABB.maxY && otherRoom.AABB.maxY >= this.AABB.minY);
    }

    getFloorColor(){
        return this.floorColor;
    }

    getWallColor(){
        return this.wallColor;
    }

    onPlayerEnter(game){
        console.log("PLAYER ENTERED!");
        this.mobSpawners.forEach(m => m.onPlayerEnter(game));
    }

    tick(game,deltaTime){
        this.mobSpawners.forEach(m => m.tick(game,deltaTime));
    }
}

export default Room;