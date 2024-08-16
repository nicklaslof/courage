class Animation{

    constructor(){
        this.states = new Map();
        this.currentStateName;
        this.currentSprite;
        this.currentStateIndex = 0;
        this.currentDelay = 0;
        this.currentTimer = 0;
    }

    addState(name, sprite, delay){
        let state = this.states.get(name);
        if (state == null){
            state = [];
            this.states.set(name,state);
        }
        state.push({sprite:sprite,delay});
        return this;
    }

    setCurrentState(name){
        if (this.currentStateName == name) return;
        this.currentStateName = name;
        this.currentDelay = 0;
        this.currentTimer = Number.MAX_SAFE_INTEGER;
        this.currentStateIndex = 0;
    }

    tick(game,deltaTime){
        
        if (this.currentStateName == null) return;
        
        let state = this.states.get(this.currentStateName);

        if (state[this.currentStateIndex] == null) this.currentStateIndex = 0;
        let animation = state[this.currentStateIndex];

        if (this.currentSprite == null) this.currentSprite = animation.sprite;
        this.currentDelay = animation.delay;

        this.currentTimer += deltaTime;

        if (this.currentTimer >= this.currentDelay){
            this.currentSprite = animation.sprite;
            this.currentStateIndex++;
            this.currentTimer = 0;
        }

        
    }

}

export default Animation;