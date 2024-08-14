import Sprite from "../graphic/sprite.js";

class Tile{

    constructor(texX,texY,texW,texH,c=0xffffffff){
        this.sprite = new Sprite(0,0,texX,texY,texW,texH,16,16,c);
        this.sprite.sizeX = this.sprite.sizeY = 64;
        console.log("created tile "+this.sprite);
        return this;
    }

    render(game){
        this.sprite.render(game);
    }

}

export default Tile;