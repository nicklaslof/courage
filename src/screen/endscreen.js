import IntroScreen from "./introscreen.js";

class EndScreen extends IntroScreen{
    constructor(game,clickAction){
        super(game,clickAction);
        this.clickToRestart = true;
        this.clickCounter = 2000;
    }

    tick(game, deltaTime){
        super.tick(game,deltaTime);
        if (this.clickCounter > 0) this.clickCounter -= deltaTime;
        
        if (this.clickToRestart && this.clickCounter <= 0 && game.input.firePressed)this.clickAction;
    }
}

export default EndScreen;