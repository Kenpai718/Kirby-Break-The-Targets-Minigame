class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine
        
        //game status
        this.gameTargets = [];
        this.title = false;
        this.numTargets = 0;
        this.music = false;
        this.myScoreBoard = this.game.myScoreBoard;

        //testing goblin animations
        //this.test = new Skeleton(this.game, 400, 927)
        //this.game.addEntity(this.test);

        //main character
        this.player = new CupidKirby(this.game, (this.game.surfaceWidth / 2) - 50, 0);
        this.game.addEntity(this.player);

        //this.loadLevel1();
        this.loadPrototypeLevel();
        
    };

    hasClearedTargets() {
        return (this.numTargets == this.myScoreBoard.myNumHit) ? true : false;
    };

    spawnTargets(num) {
        for(let i = 0; i < num; i++) {
            let target = new Target(this.game);
            this.numTargets++;
            this.game.addEntityToFront(target);
       }
    }

    update() {

        this.myScoreBoard.update();
        
        //console.log(this.hasClearedTargets());
        if(this.hasClearedTargets()) {
            //finished one round start another
            //play completion sound
            ASSET_MANAGER.playAsset("./sound/bonus.mp3");
            ASSET_MANAGER.playAsset("./sound/poyo.mp3");

            this.myScoreBoard.myWave++;
            this.spawnTargets(10);
        }
        
        //console.log(this.targets);
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };

    draw(ctx) {
        this.myScoreBoard.draw(ctx);
        if(PARAMS.DEBUG) {
            //console.log("debug");
            this.viewDebug(ctx);
        }
    };


    //demo of entities for prototshowcase
    loadPrototypeLevel() {
        //ground
        let bg = new Background(this.game);
        let ground = new Ground(this.game, 0, this.game.surfaceHeight - PARAMS.BLOCKWIDTH + 10, this.game.surfaceWidth, PARAMS.BLOCKWIDTH, true);

        this.spawnTargets(this.numTargets);
       

        //add entities
        this.game.addEntity(ground);

        //background always last
        this.game.addEntity(bg);
    }



    //keyboard input
    viewDebug(ctx) {;
		ctx.font = PARAMS.DEFAULT_FONT;

		// left debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.left ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(10, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("A", 20, this.game.surfaceHeight - 20);

		// down debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.down ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(50, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("S", 60, this.game.surfaceHeight - 20);

		// up debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.up ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(50, this.game.surfaceHeight - 80, 30, 30);
		ctx.fillText("W", 60, this.game.surfaceHeight - 60);

		// right debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.right ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(90, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("D", 100, this.game.surfaceHeight - 20);

		// jump debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.jump ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(130, this.game.surfaceHeight - 40, 75, 30);
		ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

		// shoot debug

		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.attack ? "Pink" : "Red";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(270, this.game.surfaceHeight - 40, 60, 30);
		ctx.fillText("Shoot", 275, this.game.surfaceHeight - 20);
        
	}
}
