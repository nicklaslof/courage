import Tile from "./tile.js";

class Tiles{
    static wall1 = new Tile(16,16,16,16);
    static wall_rightend = new Tile(32,16,16,16);
    static wall_leftend = new Tile(0,16,16,16);
    static wall_right = new Tile(32,22,16,1);
    static wall_left = new Tile(0,22,16,1);
    static wall_bottom = new Tile(16,32,16,16);
    static wall_bottom_left_corner = new Tile(0,32,16,16);
    static wall_bottom_right_corner = new Tile(32,32,16,16);
    static floor1 = new Tile(0,0,16,16);
    static air = new Tile(0,0,0,0,0xff000000);


}


export default Tiles;