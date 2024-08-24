class UI{

    constructor(){
        this.canvas = document.getElementById("u");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = W;
        this.canvas.height = H;
    }

    tick(game,deltaTime){
        if (!game.showIntro){
            this.instructionX = this.instructionX == null ? game.screen.level.player.x - 94 : this.instructionX;
            this.instructionY = this.instructionY == null ? game.screen.level.player.y: this.instructionY;
        }
    }

    render(game){
        this.context.clearRect(0,0,W,H);

        if (game.showIntro){

            this.drawTextAt("Courage",(W/2)-77,40,"white",36);
            this.drawTextAt("A game for JS13k 2024 by Nicklas Löf",(W/2)-260,100,"white",24);
            this.drawTextAt("This is Billy",(W/2)-95,234,"white",24);

            this.drawTextAt("Help him get the courage",(W/2)-175,500,"white",24);
            this.drawTextAt("to face his 13 different phobias",(W/2)-236,550,"white",24);

            this.drawTextAt("Click to start!",(W/2)-108,705,"white",24);

        }else{
            // Draw levelname
            let level = game.screen.level;
            this.drawTextAt("Chapter "+ level.chapter + ": "+level.name,20,16,"white",14);
            
            // Draw Fear vs Courage text
            this.drawTextAt("Fear",20,50,"white",14);
            this.drawTextAt("Courage",160,50,"white",14);

            // Draw meter bar
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(18,24,202,12);

            // Draw the courage bar
            let courage = Math.min(200,game.screen.level.player.health*2);
            let color = this.interpolateColor("ff0000", "#00ff00",courage/2);
            this.context.fillStyle = color;
            this.context.fillRect(19,25,courage,10);

            // Draw instructions
            if (level.chapter == 1){
            let screenCord = this.projectWorldToScreen(game,this.instructionX,this.instructionY);
            this.drawTextAt("WASD to move",screenCord.x,screenCord.y,"white",14);
            this.drawTextAt("Left mouse button to shoot",screenCord.x,screenCord.y+20,"white",14);
            this.drawTextAt("Right mouse button to throw",screenCord.x,screenCord.y+40,"white",14);
            this.drawTextAt("bombs found ",screenCord.x,screenCord.y+60,"white",14);
            }

            // Draw fear face and heart
            /*this.context.drawImage(game.texture.image,160,34,32,32,24,64,24,24);

            this.context.drawImage(game.texture.image,128,38,32,32,182,64,32,32);
            this.context.globalCompositeOperation = 'source-atop';
            this.context.fillStyle = '#ff0000';
            this.context.fillRect(182, 64, 32, 32);
            this.context.globalCompositeOperation = 'source-over';*/
    }


    }

    projectWorldToScreen(game, worldX,worldY){
        return {x: game.cameraCenterX - game.screen.level.player.x + worldX, y: game.cameraCenterY - game.screen.level.player.y + worldY};
    }


    drawTextAt(text,x,y,col, fontSize=16){
        this.doDrawTextAt(text,x+3,y+3,"black", fontSize);
        this.doDrawTextAt(text,x,y,col, fontSize);
    }    

    doDrawTextAt(text,x,y,col, fontSize=16){
        this.context.globalAlpha = 1.0
        this.context.font = "normal "+fontSize+"px monospace";
        this.context.fillStyle = col;
        this.context.fillText(text,x,y);
    }

    interpolateColor = (color1, color2, step) => {
        let hexToRgb = hex => hex.match(/.{1,2}/g).map(c => parseInt(c, 16)),
              rgbToHex = rgb => rgb.map(c => c.toString(16).padStart(2, '0')).join(''),
              [r1, g1, b1] = hexToRgb(color1.slice(1)),
              [r2, g2, b2] = hexToRgb(color2.slice(1)),
              interpolate = (start, end) => Math.round(start + (end - start) * (step / 100));
        return `#${rgbToHex([interpolate(r1, r2), interpolate(g1, g2), interpolate(b1, b2)])}`;
    };
    
}

export default UI;