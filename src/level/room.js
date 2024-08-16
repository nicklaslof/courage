import Tiles from "../tile/tiles.js";

class Room{

    constructor(level, startTileX, startTileY, width, height){
        /*console.log("Room size: "+width +" x "+ height);
        console.log("startTileX "+startTileX+ " startTileY "+startTileY);
        console.log("endTileX " + (startTileX+width) + " endTileY "+(startTileY+height));
        */

        for (let x = startTileX; x < width; x++){
            for (let y = startTileY; y < height; y++){
                if (y == startTileY && x > startTileX && x < startTileX+width-1) level.addTile(x,y,Tiles.wall1);
                else if (x == startTileX && y == startTileY) level.addTile(x,y,Tiles.wall_leftend);
                else if (x == startTileX+width-1 && y == startTileY) level.addTile(x,y,Tiles.wall_rightend);
                else if (x == startTileX && y < startTileY+height-1) level.addTile(x,y,Tiles.wall_left);
                else if (x == startTileX+width-1 && y < startTileY + height-1) level.addTile(x,y,Tiles.wall_right);
                else if (y == startTileY+height-1 && x > startTileX && x < startTileX+width-1) level.addTile(x,y,Tiles.wall_bottom);
                else if (x == startTileX && y == startTileY+height-1) level.addTile(x,y,Tiles.wall_bottom_left_corner);
                else if (x == startTileX+width-1 && y == startTileY+height-1) level.addTile(x,y,Tiles.wall_bottom_right_corner);
                else level.addTile(x,y,Tiles.floor1);

                if (Math.random() < 0.1){
                    let size = 200+Math.random()*320;
                    level.addLight(x*64,y*64,Math.random()*Number.MAX_SAFE_INTEGER,size,size,10000);
                }
            }
        }
    }
}

export default Room;