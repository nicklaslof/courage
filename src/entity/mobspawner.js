import Tiles from "../tile/tiles.js";

class Mobspawner{

    constructor(x,y,mobs,maxMobsToSpawn,timeToSpawn){
        this.x = x;
        this.y = y;
        this.mobs = mobs;
        this.spawned = false;
        this.maxMobsToSpawn = maxMobsToSpawn;
        this.timeToSpawn = timeToSpawn;
        this.calculatePlayerDirectionVector = {x:0, y:0};
    }


    onPlayerEnter(game){
        this.spawnTimer = this.timeToSpawn == null ? game.getRandom(5000,15000):this.timeToSpawn;
    }

    tick(game,deltaTime){
        if(this.spawnTimer>0)this.spawnTimer-=deltaTime;
        else if(!this.spawned){
            let player = game.screen.level.player;
            this.calculatePlayerDirectionVector.x = player.x - this.x*64;
            this.calculatePlayerDirectionVector.y = player.y - this.y*64;

            if (game.length(this.calculatePlayerDirectionVector) < 256 && game.canEntitySee(game.screen.level,player.x,player.y,this.x*64,this.y*64)) {
                this.spawned=true;
                game.playMobSpawner();
                this.mobs.forEach(m=>{
                    for(let i=0;i<this.maxMobsToSpawn;i++){
                        let [spawnX,spawnY]=[this.x,this.y].map(c=>c+Math.floor(game.getRandom(-1,1)));
                        if(game.screen.level.getTile(spawnX,spawnY)==Tiles.floor1){
                            game.screen.level.addEntity(new m(spawnX*64,spawnY*64));
                            for(let j=0;j<16;j++)
                                game.screen.level.addParticle(spawnX*64,spawnY*64,0xffcccccc,game.getRandom(8,16),game.getRandom(8,16),game.getRandom(800,1500),{x:game.getRandom(-1,1),y:game.getRandom(-1,1)},game.getRandom(50,80));
                        }
                    }
                });
            }
        }
    }
}

export default Mobspawner;