import Tiles from "../tile/tiles.js";

class Mobspawner{

    constructor(x,y,mobs,maxMobsToSpawn,timeToSpawn){
        this.x = x;
        this.y = y;
        this.mobs = mobs;
        this.spawned = false;
        this.maxMobsToSpawn = maxMobsToSpawn;
        this.timeToSpawn = timeToSpawn;
    }


    onPlayerEnter(game){
        this.spawnTimer = this.timeToSpawn == null ? game.getRandom(5000,10000):this.timeToSpawn;
    }

    tick(game,deltaTime){
        if (this.spawnTimer> 0) this.spawnTimer -= deltaTime;
        else if (!this.spawned){
            this.spawned = true;
            game.playMobSpawner();
            
            this.mobs.forEach(m => {
                for (let i = 0;i < this.maxMobsToSpawn;i++){
                    let spawnX = this.x + Math.floor(game.getRandom(-1,1));
                    let spawnY = this.y + Math.floor(game.getRandom(-1,1));
                    if (game.screen.level.getTile(spawnX,spawnY) == Tiles.floor1){
                        game.screen.level.addEntity(new m(spawnX*64,spawnY*64));
                        for (let i = 0; i < 16;i++){
                            let ps = game.getRandom(8,16);
                            game.screen.level.addParticle((spawnX*64),(spawnY*64),0xffcccccc,ps,ps,game.getRandom(800,1500),{x:game.getRandom(-1,1),y:game.getRandom(-1,1)},game.getRandom(50,80));
                        }
                    }
                }
                
            });
        }
    }

}

export default Mobspawner;