class Texture{

    constructor(filename){
        this.image = new Image();
        this.dirty = true;

        this.image.onload = () =>{

            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            this.height = canvas.height = this.image.height;
            this.width = canvas.width = this.image.width;
            context.drawImage(this.image,0,0);
            this.pixels = new Uint32Array(context.getImageData(0,0,this.image.width, this.image.height).data.buffer);

            this.dirty = false;
            console.log(this.pixels);            
            
        }

        this.image.src = filename;
    }


}

export default Texture;