import Tiles from "../tile/tiles.js";

class Room{

    constructor(level, startTileX, startTileY, width, height, floorColor=0xffffffff, wallColor=0xffffffff){
        /*console.log("Room size: "+width +" x "+ height);
        console.log("startTileX "+startTileX+ " startTileY "+startTileY);
        console.log("endTileX " + (startTileX+width) + " endTileY "+(startTileY+height));
        */

        this.floorColor = floorColor;
        this.wallColor = wallColor;

        for (let x = startTileX; x < width; x++){
            for (let y = startTileY; y < height; y++){
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
            }
        }
    }

    getFloorColor(){
        return this.floorColor;
    }

    getWallColor(){
        return this.wallColor;
    }
}

export default Room;