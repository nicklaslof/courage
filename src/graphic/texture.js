import GlTexture from "./gltexture.js";

// This class will copy the pixel from the asset texture into a bigger texture.
// On this bigger texture other generated textures can be created
// and in the end only one texture has to be uploaded to the GPU
class Texture{
    constructor(gl) {
        var assetImage = new Image();
        this.image = new Image();
        this.glTexture = null;

        assetImage.onload = () =>{
            var canvas = document.getElementById('t');
            canvas.width = canvas.height= assetImage.width;
            let ctx = canvas.getContext('2d');
    
            // Draw asset texture to the canvas and fetch the imagedata
            ctx.drawImage(assetImage,0,0);
            var imageData = ctx.getImageData(0,0,assetImage.width, assetImage.height);

            // Set the canvas to our final texture size and fill it with transparent color
            canvas.width = canvas.height = 2048;
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fillRect(0,0,2048,2048);

            ctx.font = "normal 32px monospace";
            ctx.fillStyle = "white";
            ctx.fillText("\u2665",128,60,32);

            // Create light circle
            var radgrad = ctx.createRadialGradient(370,470,0,370,470,250);
            radgrad.addColorStop(0, 'rgba(255,255,255,1)');
            //radgrad.addColorStop(0.9, 'rgba(255,255,255,.9)');
            radgrad.addColorStop(1, 'rgba(255,255,255,0)');          
            ctx.fillStyle = radgrad;
            ctx.fillRect(128,200,550,550);
            
            // Draw the imagedata from the asset texture to it
            ctx.putImageData(imageData,0,0);
            this.image.src = canvas.toDataURL();
        };

        assetImage.src = "t.png";
        this.glTexture = new GlTexture(gl,this.image);
    }
}

export default Texture;