import Game from "./game.js";

let game = new Game();

update();

function update(){
    requestAnimationFrame(update);
    game.update();
}
