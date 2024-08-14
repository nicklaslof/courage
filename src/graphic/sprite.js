class Sprite{

    constructor(x,y,texX,texY,texW,texH,sizeX,sizeY,c){
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.c = c;                     // The tint color of the entity. Shortened as c because color is a reserved word so it stays when minifying
        this.rotation = 0;
        this.horizontalFlip = false;
        this.setupUV(texX,texY,texW,texH);
    }

    setupUV(texX,texY,texW,texH){
        this.u0 = texX/TZ;              // WebGL UVs of the texture
        this.u1 = texY/TZ;              // WebGL UVs of the texture
        this.v0 = this.u0 + (texW/TZ);  // WebGL UVs of the texture
        this.v1 = this.u1 + (texH/TZ);  // WebGL UVs of the texture
    }

    tick(deltaTime){
       
    }

    render(game){
        game.gl.col = this.c;
        game.gl.flip = this.horizontalFlip;
        game.gl.img(game.texture.glTexture.tex,-this.sizeX/2,-this.sizeY/2,this.sizeX,this.sizeY,0,this.x,this.y,1,1, this.u0, this.u1, this.v0, this.v1);
    }

}

export default Sprite;