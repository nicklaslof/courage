class Sprite{

    constructor(x,y,texture){
        this.x = x;
        this.y = y;
        this.texture = texture;



    }

    tick(deltaTime){
       
    }

    render(screen){
        for(let x = 0; x < 16;x++){
            for (let y = 0; y < 16;y++){
                screen.setPixelAt(this.x+x,this.y+y,this.texture.pixels[x+y*this.texture.width]);
            }
        }
    }

}

export default Sprite;