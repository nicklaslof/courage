import Tiles from "../tile/tiles.js";
import Enemy from "../entity/enemy.js";
import Decoration from "../entity/decoration.js";

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

    generateRoom(level, game, startTileX, startTileY, width, height, floorColor=0xffffffff, wallColor=0xffffffff){
        this.floorColor = floorColor;
        this.wallColor = wallColor;
        this.x = startTileX;
        this.y = startTileY;
        this.width = width;
        this.height = height;
        this.enemies = [];


        // Roomtype:
        // n = normal
        // r = red battle room
        this.roomType = "n";

        if (Math.random()< 0.2) this.roomType = "r";

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
                    //level.addLight(x*64,y*64,Math.random()*Number.MAX_SAFE_INTEGER,size,size,10000);
                    
                }
                let r = this.roomType == "n" ? Math.random()<0.05 : Math.random() < 0.1;
                if (r && level.getTile(x,y) == Tiles.floor1){
                    for(let i = 0; i < Math.floor(game.getRandom(3,10));i++){
                        let spawnX = (x*64)+game.getRandom(-64,64);
                        let spawnY = (y*64)+game.getRandom(-64,64);
                        if (level.getTile(Math.round(spawnX/64),Math.round(spawnY/64)) == Tiles.floor1){
                            let e = new Enemy(spawnX,spawnY);
                            this.enemies.push(e);
                            level.addEntity(e);
                        }
                    }
                }

            }
        }

        //Add decorations
        for(let x=startTileX;x<startTileX+width;x++)
            for(let y=startTileY;y<startTileY+height;y++){
                let t=level.getTile(x,y);
                if(Math.random()<0.2) switch(t){
                    case Tiles.wall1:level.addDecoration(new Decoration(level,x*64,y*64,8,24,"t"));break;
                    case Tiles.wall_bottom:level.addDecoration(new Decoration(level,x*64,y*64-32,8,24,"t"));break;
                    case Tiles.wall_left:level.addDecoration(new Decoration(level,x*64+23,y*64,8,24,"t"));break;
                    case Tiles.wall_right:level.addDecoration(new Decoration(level,x*64-22,y*64,8,24,"t"));break;
                }

                switch(t){
                    case Tiles.floor1:
                        if(this.roomType == "r" && Math.random()<0.5)level.addDecoration(new Decoration(level,x*64,y*64,64,64,"c"));
                        if(this.roomType == "n" && Math.random()<0.3)level.addDecoration(new Decoration(level,x*64,y*64,64,64,"d"));
                }
            }
        Room.id++;
        this.roomId = Room.id;
    }

    removeAllEnemies(level){
        this.enemies.forEach(e=> level.removeEntity(e));
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
        
    }

    tick(game,deltaTime){
        
    }
}

export default Room;