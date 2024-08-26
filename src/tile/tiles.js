import Tile from "./tile.js";

class Tiles{
    static wall1 = new Tile(16,16,16,16,0xffcc9999,{minX:0,minY:0,maxX:64,maxY:24});
    static wall_rightend = new Tile(32,16,16,16,0xffcc9999,{minX:0,minY:0,maxX:64,maxY:64});
    static wall_leftend = new Tile(0,16,16,16,0xffcc9999,{minX:0,minY:0,maxX:64,maxY:64});
    static wall_right = new Tile(32,22,16,1,0xffcc9999,{minX:0,minY:0,maxX:64,maxY:64});
    static wall_left = new Tile(0,22,16,1,0xffcc9999,{minX:0,minY:0,maxX:64,maxY:64});
    static wall_bottom = new Tile(16,32,16,16,0xffcc9999);
    static wall_bottom_left_corner = new Tile(0,32,16,16,0xffcc9999);
    static wall_bottom_right_corner = new Tile(32,32,16,16,0xffcc9999);
    static floor1 = new Tile(0,0,16,16,0xffffffff);
    static lava = new Tile(3,3,1,1,0xff00a5ff);
    static air = new Tile(0,0,0,0,0xffffffff);
    static stairs = new Tile(48,0,16,16,0xffffffff);
}


export default Tiles;