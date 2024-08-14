class Entity{

    constructor(x,y,sprite){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.horizontalFlip = false;
        this.moveDirection = {x:0,y:0};
        this.speed = 1;
    }


    tick(game,deltaTime){
        this.x += this.moveDirection.x * this.speed;
        this.y += this.moveDirection.y * this.speed;

        if (this.moveDirection.x < 0) this.horizontalFlip = false;
        if (this.moveDirection.x > 0) this.horizontalFlip = true;
    }

    render(game){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.horizontalFlip = this.horizontalFlip;
        this.sprite.render(game);
    }

}

export default Entity;