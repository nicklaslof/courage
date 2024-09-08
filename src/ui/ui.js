class UI{

    // Render the UI on a seperate Canvas that is overlayed the game canvas.
    constructor(){
        this.canvas = document.getElementById("u");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = W;
        this.canvas.height = H;
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

        } else if (game.showDiffcultySelection){
            this.drawTextAt("Select diffculty",(W/2)-115,234,"white",24);
            this.drawTextAt("(1) Easy    (2) Medium    (3) Hard",(W/2)-248,500,"white",24);
        
        } else if (game.gameFinished){

            this.drawTextAt("You did it!",(W/2)-116,40,"white",36);
            this.drawTextAt("Billy no longer has his 13 different phobias.",(W/2)-322,100,"white",24);
            this.drawTextAt("Thanks for playing  / Nicklas",(W/2)-210,705,"white",24);

        }else if (game.gameOver){
            this.drawTextAt("Game over!",(W/2)-106,40,"white",36);
            this.drawTextAt("Click to restart level",(W/2)-162,106,"white",24);
            

        }else{
            if (game.playerSays != null && !game.isLevelTransition()){
                let l = game.playerSays.length;
                let pos = this.projectWorldToScreen(game,game.screen.level.player.x-(l*3.5),game.screen.level.player.y-12);
                this.drawTextAt(game.playerSays,pos.x,pos.y,"white",14);
                
            }
            if (game.isLevelTransition()){
                let level = game.screen.level;
                this.drawTextAt("Chapter "+ level.chapter + "/9:",(W/2)-112,(H/2)-150,"white",30);
                let levelNameLength = level.name.length;
                this.drawTextAt(level.name,(W/2)-(levelNameLength*9.4),(H/2)-50,"white",30);
            }else{
                this.drawMiniMap(game);
                // Draw levelname
                let level = game.screen.level;
                this.drawTextAt("Chapter "+ level.chapter + ": "+level.name,20,36,"white",14);
                
                // Draw Fear vs Courage text
                this.drawTextAt("Fear",20,70,"white",14);
                this.drawTextAt("Courage",160,70,"white",14);

                // Draw meter bar
                this.drawCourageMeter(18,44,1,1,true,game.screen.level.player.health);


                this.drawTextAt("Bombs: "+game.screen.level.player.bombs,20,96,"white",14);

                // Draw instructions
                if (level.chapter < 2){
                    this.instructionX = this.instructionX == null ? game.screen.level.player.x - 64 : this.instructionX;
                    this.instructionY = this.instructionY == null ? game.screen.level.player.y+40: this.instructionY;   
                    let screenCord = this.projectWorldToScreen(game,this.instructionX,this.instructionY);
                    this.drawTextAt("WASD:move",screenCord.x,screenCord.y,"white",14);
                    this.drawTextAt("LMB:shoot",screenCord.x,screenCord.y+30,"white",14);
                    this.drawTextAt("RMB/Spacebar:glide to avoid damage",screenCord.x,screenCord.y+60,"white",14);
                    //this.drawTextAt("damage and move faster",screenCord.x,screenCord.y+80,"white",14);
                    this.drawTextAt("E:throw bombs",screenCord.x,screenCord.y+90,"white",14);
                }


                if (game.screen.level.boss && game.screen.level.boss.health>0){
                    let bossPos = this.projectWorldToScreen(game,game.screen.level.boss.x,game.screen.level.boss.y-8);
                    this.drawCourageMeter(bossPos.x,bossPos.y,0.8,1.2,true,game.screen.level.boss.health*3.33);  
                }

                let pos = this.projectWorldToScreen(game,game.screen.level.player.x+12,game.screen.level.player.y-8);
                this.drawCourageMeter(pos.x,pos.y,0.1,0.6,true,game.screen.level.player.health,"#000000");

                // Draw fear face and heart
                /*this.context.drawImage(game.texture.image,160,34,32,32,24,64,24,24);

                this.context.drawImage(game.texture.image,128,38,32,32,182,64,32,32);
                this.context.globalCompositeOperation = 'source-atop';
                this.context.fillStyle = '#ff0000';
                this.context.fillRect(182, 64, 32, 32);
                this.context.globalCompositeOperation = 'source-over';*/

                //Disable the code below for debug draw of collision world tiles vs entites

                /*let player = game.screen.level.player;
                for(let x = Math.floor((player.x -W)/64); x < Math.floor((player.x + W)/64); x++){
                    for (let y = Math.floor((player.y -H)/64); y < Math.floor((player.y + H)/64); y++){
                        let tile = level.getTile(x,y);
                        if (tile == null) continue;

                        let AABB = tile.AABB;
                        let min = this.projectWorldToScreen(game,AABB.minX + x*64,AABB.minY + y*64);
                        let max = this.projectWorldToScreen(game,AABB.maxX + x*64,AABB.maxY + y*64);

                        this.context.fillStyle="green";
                        this.context.fillRect(min.x,min.y,(max.x-min.x),(max.y-min.y));
                        this.context.clearRect(min.x+1,min.y+1,(max.x-min.x)-2,(max.y-min.y)-2);
                    }
                }

                level.entities.forEach(e=> {
                    let AABB = e.AABB;
                    let min = this.projectWorldToScreen(game,Math.floor(AABB.minX),Math.floor(AABB.minY));
                    let max = this.projectWorldToScreen(game,Math.floor(AABB.maxX),Math.floor(AABB.maxY));

                     this.context.fillStyle="red";
                    this.context.fillRect(min.x,min.y,(max.x-min.x),(max.y-min.y));
                    this.context.clearRect(min.x+1,min.y+1,(max.x-min.x)-2,(max.y-min.y)-2);
                })*/
            }
        }
    }

    drawMiniMap(game){
        let x = 2048;
        let y = 2048;
        game.screen.level.rooms.forEach(r => {
            if (r.x < x) x = r.x;
            if (r.y < y) y = r.y;
        })

        game.screen.level.rooms.forEach(r => {
            this.context.fillStyle = r.lastRoom?"rgb(0 255 0 / 20%)": r == game.screen.level.player.currentRoom ? "blue" : "rgb(255 255 255 / 20%)";
            this.context.fillRect(20+r.x-x,120+r.y-y,r.width,r.height);
        })
    }
    drawCourageMeter(x,y,scaleX,scaleY,border,health,c="#ffffff") {
        //Draw the border around the courage bar
        if (border){
            this.context.fillStyle = c;
            this.context.fillRect(x, y, 202*scaleX, 12*scaleY);
        }

        // Draw the courage bar
        let courage = Math.min(200, health * 2);
        let color = this.interpolateColor("ff0000", "#00ff00", courage / 2);
        this.context.fillStyle = color;
        this.context.fillRect(x+2,y+2 , (courage*scaleX)-3, (8*scaleY)-1);
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