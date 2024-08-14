class Entity{

    constructor(x,y,sprite){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.horizontalFlip = false;
        this.moveDirection = {x:0,y:0};
        this.speed = 1;
        this.animation = null;
    }

    tick(game,deltaTime){

        if (this.animation != null){
            this.animation.tick(game,deltaTime);
            this.sprite = this.animation.currentSprite;
        }

        this.x += this.moveDirection.x * this.speed * deltaTime/1000;
        this.y += this.moveDirection.y * this.speed * deltaTime/1000;

        if (this.moveDirection.x < 0) this.horizontalFlip = false;
        if (this.moveDirection.x > 0) this.horizontalFlip = true;
    }

    render(game){
        this.sprite.x = (game.cameraCenterX - game.screen.level.player.x) + this.x;
        this.sprite.y = (game.cameraCenterY - game.screen.level.player.y) + this.y;
        this.sprite.horizontalFlip = this.horizontalFlip;
        this.sprite.render(game);
    }

}

export default Entity;