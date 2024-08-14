import Sprite from "../graphic/sprite.js";

class Tile{

    constructor(texX,texY,texW,texH){
        this.sprite = new Sprite(0,0,texX,texY,texW,texH,16,16,0xffffffff);
        this.sprite.sizeX = this.sprite.sizeY = 32;
        console.log("created tile "+this.sprite);
    }

    render(game){
        this.sprite.render(game);
    }

}

export default Tile;