class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //add scene manager as an entity to game engine

        //game status
        this.gameTargets = [];
        this.title = true;
        this.transition = false;
        this.numTargets = 0;
        this.music = false;
        this.myScoreBoard = this.game.myScoreBoard;
        this.myTimer = DEFAULT_GAME_TIMER;
        this.mySpawnTargets = 10; //increase with each wave

        //testing goblin animations
        //this.test = new Skeleton(this.game, 400, 927)
        //this.game.addEntity(this.test);

        //main character
        this.player = new CupidKirby(this.game, (this.game.surfaceWidth / 2) - 50, 0);
        this.game.addEntity(this.player);

        this.loadTitle();

        //this.loadLevel1();
        this.loadLevel();
    };

    resetGame() {
        this.myScoreBoard.reset();
        this.numTargets = 0;
        this.myTimer = DEFAULT_GAME_TIMER;
        this.mySpawnTargets = 10;
    }


    loadTitle() {
        this.title = true;
        var x = (this.game.surfaceWidth / 2) - ((40 * 10) / 2);
        var y = (this.game.surfaceHeight / 2) - 40;
        this.startGameBB = new BoundingBox(x, y, 40 * 10, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 8) / 2);
        y = (this.game.surfaceHeight / 2) + 40;
        this.controlsBB = new BoundingBox(x, y, 40 * 8, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 7) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 3;
        this.creditsBB = new BoundingBox(x, y, 40 * 7, -40);
    }

    /**
    * Transition Screen
    */
    loadTransition() {
        this.transition = true;
        this.clearEntities();
        var x = (this.game.surfaceWidth / 2) - ((40 * 10) / 2);
        var y = (this.game.surfaceHeight / 2) - 40;
        this.nextLevelBB = new BoundingBox(x, y, 40 * 10, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 13) / 2);
        y = (this.game.surfaceHeight / 2) + 40;
        this.restartLevelBB = new BoundingBox(x, y, 40 * 13, -40);
        x = (this.game.surfaceWidth / 2) - ((40 * 14) / 2);
        y = (this.game.surfaceHeight / 2) + 40 * 3;
        this.returnToMenuBB = new BoundingBox(x, y, 40 * 14, -40);
    };


    hasClearedTargets() {
        return (this.numTargets == this.myScoreBoard.myNumHit) ? true : false;
    };

    spawnTargets(num) {
        for (let i = 0; i < num; i++) {
            let target = new Target(this.game);
            this.numTargets++;
            this.game.addEntityToFront(target);
        }
    }

    update() {
        if (this.myTimer <= 0) {
            this.transition = true;
            this.myTimer = DEFAULT_GAME_TIMER;
            ASSET_MANAGER.playAsset(SFX.GAME);
        }


        if (this.title) {
            this.textColor = 0;
            if (this.game.mouse) {
                if (this.startGameBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 1;
                } else if (this.controlsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 2;
                } else if (this.creditsBB.collideMouse(this.game.mouse.x, this.game.mouse.y)) {
                    this.textColor = 3;
                }
            }
            if (this.game.click) {
                if (this.startGameBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.game.attack = false;
                    this.startGame();
                } else if (this.controlsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.credits = false;
                    this.controls = !this.controls;
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                } else if (this.creditsBB.collideMouse(this.game.click.x, this.game.click.y)) {
                    this.controls = false;
                    this.credits = !this.credits;
                    ASSET_MANAGER.playAsset(SFX.CLICK);
                }
                this.game.click = null;
            }
        } else if (this.transition) { //results screen

        } else { //game is playing
            this.myTimer -= this.game.clockTick;
            this.myScoreBoard.update();

            //console.log(this.hasClearedTargets());
            if (this.hasClearedTargets()) {
                //finished one round start another
                //play completion sound
                ASSET_MANAGER.playAsset(SFX.BONUS);
                ASSET_MANAGER.playAsset(SFX.POYO);

                this.myScoreBoard.myWave++;
                this.spawnTargets(10);
            }
        }



        //console.log(this.targets);
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };

    draw(ctx) {

        if (this.title) {
            var fontSize = 43;
            var titleFont = fontSize + 'px "Press Start 2P"';
            ctx.font = "Bold" + titleFont;
            let gameTitle = "Kirby's Target Practice";

            ctx.font = titleFont;
            drawWithBorder(ctx, gameTitle, (this.game.surfaceWidth / 2) - ((fontSize * gameTitle.length) / 2) + 1, fontSize * 3 + 1, "Pink");

            ctx.font = '40px "Press Start 2P"';
            ctx.fillStyle = this.textColor == 1 ? "DeepPink" : "Black";
            ctx.fillText("Start Game", this.startGameBB.x, this.startGameBB.y);
            ctx.fillStyle = this.textColor == 2 ? "BlueViolet" : "Black";
            ctx.fillText("Controls", this.controlsBB.x, this.controlsBB.y);
            ctx.fillStyle = this.textColor == 3 ? "BlueViolet" : "Black";
            ctx.fillText("Credits", this.creditsBB.x, this.creditsBB.y);
            ctx.strokeStyle = "Red";
        } else {
            this.myScoreBoard.draw(ctx);

        }

        if (PARAMS.DEBUG) {
            //console.log("debug");
            this.viewDebug(ctx);
        }

    };

    startGame() {
        this.title = false;
        this.transition = false;
        this.spawnTargets(10);
        ASSET_MANAGER.playAsset(SFX.GO)
    }


    //demo of entities for prototshowcase
    loadLevel() {
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
    viewDebug(ctx) {
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
