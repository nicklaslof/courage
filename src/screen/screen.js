
import Sprite from "../graphic/sprite.js";
import Level from "../level/level.js";

class Screen{
    constructor(width, height,texture){
        this.width = width;
        this.height = height;
        this.imageData = new ImageData(this.width, this.height);
        this.pixels = new Uint32Array(this.imageData.data.buffer);

        this.texture = texture

        this.entities = [];
        //for (let index = 0; index < 2; index++) {
        //    this.entities.push(new Sprite(-200+Math.floor(Math.random()*900),-150+Math.floor(Math.random()*600),this.texture));
        //}

        this.level = new Level(32,32,texture);
    }

    tick(deltaTime){
        this.level.tick(deltaTime);
        this.entities.forEach(e => e.tick(deltaTime));
    }

    render(context){
        if (this.texture.dirty) return;

        //Clear the pixels for every frame
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i] = 0xff000000;
        }

        // Draw stuff

        this.level.render(this);
        this.entities.forEach(e => e.render(this));

        
        // Render the pixels to the browser canvas
        context.putImageData(this.imageData,0,0);
    }

    setPixelAt(x,y,c){
        if (x < 0 || x > this.width || y < 0 || y > this.height || c == 0) return
        this.pixels[Math.floor(x) + Math.floor(y) * this.width] = c;
    }

}

export default Screen;