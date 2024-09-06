class Light{

    constructor(x,y,c,sizeX=550,sizeY=550,ttl=10000,flicker=false) {
        this.x = x;
        this.y = y;
        this.renderX = 0;
        this.renderY = 0;
        this.c = c;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.u0 = 128/TZ;
        this.u1 = 200/TZ;
        this.v0 = this.u0 + (550/TZ);
        this.v1 = this.u1 + (550/TZ);
        this.ttl = ttl; // if light has a ttl more than 10 seconds it will burn forever
        this.disposed = false;
        this.renderOffsetX = 0;
        this.renderOffsetY = 0;
        this.flicker = flicker;
        this.flickerCounter = Math.random()*1000;
    }
    tick(game, deltaTime){
        if (this.ttl < 10000) this.ttl -= deltaTime;


        if (this.ttl <= 0) this.disposed = true;
        
        if (this.flicker){
            this.flickerCounter += deltaTime;
            let s = Math.sin(this.flickerCounter/120);
            this.sizeX += (s/2)*(deltaTime/2);
            this.sizeY += (s/2)*(deltaTime/2);
        }

        this.sizeX = Math.max(0,this.sizeX);
        this.sizeY = Math.max(0,this.sizeY);
        this.renderX = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.renderY = (game.cameraCenterY - game.screen.level.player.y) + this.y;
    }

    render(game){

        game.gl.col = this.c;
        game.gl.img(game.texture.glTexture.tex,(-this.sizeX/2)+this.renderOffsetX,(-this.sizeY/2)+this.renderOffsetY,this.sizeX,this.sizeY,0,this.renderX,this.renderY,1,1, this.u0, this.u1, this.v0, this.v1);
    }

}
export default Light;