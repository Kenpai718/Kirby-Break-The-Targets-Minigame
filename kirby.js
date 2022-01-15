class Kirby {
	constructor(game) {
		this.game = game;
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		//starts with a walking animation
		//this.animator = new Animator(ASSET_MANAGER.getAsset("./kirby_spritesheet.png"), 1.01, 0, 23, 24, 10, 0.1);
		this.spritesheet = ASSET_MANAGER.getAsset("./kirby_spritesheet.png");
		//animation params: img, starting x on spritesheet, starting y, width, height on spritesheet, frame count, frame speed, frame padding, reverse?, loop?

		//some animations to be used
		this.wait = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, false, true);
		this.waitFlip = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, true, true);
		this.walk = new Animator(this.spritesheet, 8, 55, 23, 20, 10, 0.1, 0, false, true);
		this.dash = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true);
		this.jump = new Animator(this.spritesheet, 7, 131, 23.5, 22, 10, 0.1, 1.5, false, true);
		this.jumpkick = new Animator(this.spritesheet, 81, 426, 25, 27, 1, 1, 3, false, true);
		this.jab = new Animator(this.spritesheet, 7, 310, 37, 22, 7, 0.1, 1.5, false, true);
		this.skid = new Animator(this.spritesheet, 229, 106, 24, 22, 1, 0.1, 0, false, true);
		//this.idle = new Animator(this.spritesheet, 14, 244, 22, 22, 17, 0.5, 5, false, true);
		this.idle = new Animator(this.spritesheet, 9, 244, 27.5, 22, 11, 0.15, 0.1, false, true);


		//variables to adjust position and movement speed
		this.groundLevel = 490;
		this.speed = 150;
		this.x = 0;
		this.y = this.groundLevel;
		this.scaling = 5;

	

		this.velocity = {x: 0, y: 0};
		this.fallAcc =

		//state
		//this.facing = "right"; //0 = right, 1 = left
		this.state = "idle"; //0 = idle, 1 = walk, 2 = run, 3 = skid, 4 = jump
		this.action = "no_atk"; //0 = no_atk, 1 = atk
		//different attack for each state
		//0 = none, 1 = punch, 2 = dash_attack, 3 = aerial_kick

		this.animations = []; //list of animations
		this.loadAnimations();

		this.animator = this.animations[this.state + this.action];
		
	};

	loadAnimations() {
		//idle
		this.animations["idle" + "no_atk"] = this.wait;
		this.animations["idle" + "atk"] = this.jab;

		//walk
		this.animations["walk" + "no_atk"] = this.walk;
		this.animations["walk" + "atk"] = this.jab;

		//run
		this.animations["run" + "no_atk"] = this.dash;
		this.animations["run" + "atk"] = this.jab; //implement dash attack later

		//run
		this.animations["skid" + "no_atk"] = this.skid;
		this.animations["skid" + "atk"] = this.skid; //no attack during skid

		//jump
		this.animations["jump" + "no_atk"] = this.jump;
		this.animations["jump" + "atk"] = this.jumpkick;
		
	};

	update() {
		const TICK = this.game.clockTick;

		// //physics constants based on mario
		// const MIN_WALK = 4.453125;
        // const MAX_WALK = 93.75;
        // const MAX_RUN = 153.75;
        // const ACC_WALK = 133.59375;
        // const ACC_RUN = 200.390625;
        // const DEC_REL = 182.8125;
        // const DEC_SKID = 365.625;
        // const MIN_SKID = 33.75;

        // const STOP_FALL = 1575;
        // const WALK_FALL = 1800;
        // const RUN_FALL = 2025;
        // const STOP_FALL_A = 450;
        // const WALK_FALL_A = 421.875;
        // const RUN_FALL_A = 562.5;

        // const MAX_FALL = 270;

		//simple static speeds until I implement velocity


		//update the state
		//horizontal
		if(this.game.left || this.game.right || this.game.dash) {
			this.state = "walk";
			this.speed = 150;

			if(!this.game.dash) { //walking
				if(this.game.left && !this.game.right) {
					this.x -= this.speed*this.game.clockTick;
				} else if(this.game.right && !this.game.left) {
					this.x += this.speed*this.game.clockTick;
				} 
			} else { //dash
				this.state = "run";
				var dashSpeed = this.speed * 2; //increase speed when dashing
				if(this.game.left && !this.game.right) {
					this.x -= (dashSpeed*this.game.clockTick) ;
				} else {
					this.x += (dashSpeed*this.game.clockTick);
				}
			}
		} else {
			this.state = "idle";
			this.speed = 0;
		}

		//vertical
		if(this.game.jump) {
			this.state = "jump";

			//implement jump physics
		} 



		//update the action
		if(this.game.attack) {
			this.action = "atk";
		} else {
			this.action = "no_atk";
		}

		//reset position if outside the canvas. Temporary solution!
		//reset loop
		if(this.x > 1024 || this.x < 0) {
			this.x = 0;
			this.y = this.groundLevel;
		}

	};



	draw(ctx) {
		//draw the full spreadsheet
		//ctx.drawImage(ASSET_MANAGER.getAsset("./kirby_walk.png"), 0, 50);
		//this.viewAll(ctx);

		this.animations[this.state + this.action].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaling);


		//debug graphic for movement controls
		this.debug(ctx);

    
    
	};

	viewAll(ctx) {
		//call animator to draw it
		this.wait.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaling);
		this.waitFlip.drawFrame(this.game.clockTick, ctx, this.x, this.y - 50, this.scaling);
		this.walk.drawFrame(this.game.clockTick, ctx, this.x + 100, this.y, this.scaling);
		this.dash.drawFrame(this.game.clockTick, ctx, this.x + 200, this.y, this.scaling);
		this.jump.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y, this.scaling);
		this.jumpkick.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y - 100, this.scaling);
		this.jab.drawFrame(this.game.clockTick, ctx, this.x + 400, this.y, this.scaling);
		this.skid.drawFrame(this.game.clockTick, ctx, this.x + 500, this.y, this.scaling);
		this.idle.drawFrame(this.game.clockTick, ctx, this.x + 600, this.y, this.scaling);

	}

	debug(ctx) {
		// left debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.left ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStlye;
        ctx.strokeRect(10, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("A", 20, this.game.surfaceHeight - 20);

        // down debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.down ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("S", 60, this.game.surfaceHeight - 20);

        // up debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.up ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(50, this.game.surfaceHeight -80, 30, 30);
        ctx.fillText("W", 60, this.game.surfaceHeight - 60);

        // right debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.right ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(90, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("D", 100, this.game.surfaceHeight - 20);

        // jump debug
        ctx.strokeStyle= "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.jump ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(130, this.game.surfaceHeight -40, 50, 30);
        ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

		// dash debug
		ctx.strokeStyle= "black";
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.dash ? "Red" : "Black";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(130, this.game.surfaceHeight - 80, 50, 30);
		ctx.fillText("LSHIFT", 140, this.game.surfaceHeight - 60);  

        // attack debug
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.game.attack ? "Red" : "Black";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeRect(190, this.game.surfaceHeight -40, 30, 30);
        ctx.fillText("P", 200, this.game.surfaceHeight - 20);
	}
}