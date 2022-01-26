class Kirby {
	constructor(game,x, y) {
		Object.assign(this, { game, x, y });
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		//starts with a walking animation
		//this.animator = new Animator(ASSET_MANAGER.getAsset("./kirby_spritesheet.png"), 1.01, 0, 23, 24, 10, 0.1);
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/kirby_spritesheet.png");
		//animation params: img, starting x on spritesheet, starting y, width, height on spritesheet, frame count, frame speed, frame padding, reverse?, loop?

		//some animations to be used
		// this.wait = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, false, true);
		// this.waitFlip = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, true, true);
		// this.walk = new Animator(this.spritesheet, 8, 55, 23, 20, 10, 0.1, 0, false, true);
		// this.dash = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true);
		// this.jump = new Animator(this.spritesheet, 7, 131, 23.5, 22, 10, 0.1, 1.5, false, true);
		// this.jumpkick = new Animator(this.spritesheet, 81, 426, 25, 27, 1, 1, 3, false, true);
		// this.jab = new Animator(this.spritesheet, 7, 310, 37, 22, 7, 0.1, 1.5, false, true);
		// this.skid = new Animator(this.spritesheet, 229, 106, 24, 22, 1, 0.1, 0, false, true);
		// //this.idle = new Animator(this.spritesheet, 14, 244, 22, 22, 17, 0.5, 5, false, true);
		this.idle = new Animator(this.spritesheet, 9, 244, 27.5, 22, 11, 0.15, 0.1, false, true);


		this.dir = { left: 0, right: 1 };
		this.states = {
			idle: 0, walk: 1, dash: 2, jump: 3, falling: 4,
			jumpkick: 5, attack: 6, shoot: 7
		}

		//variables to adjust position and movement speed
		this.groundLevel = 490;
		this.speed = 150;
		this.scaling = 3;

		this.x = x;
		this.y = this.groundLevel;
		this.width = 25 * this.scaling;
        this.height = 18 * this.scaling;
		



		this.velocity = { x: 0, y: 0 };
		this.fallAcc = 1500;

		//states
		this.DEFAULT_DIRECTION = this.dir.right;
		this.DEFAULT_ACTION = this.states.idle;

		this.facing = this.dir.right;
		this.action = this.states.idle;

		this.inAir = false;
		this.doubleJump = false;



		//animations
		this.animations = []; //list of animations
		this.loadAnimations();


		//bounding box
		this.updateBB();

	};

	loadAnimations() {
		let numDir = 2;
		let numStates = 7;
		for (var i = 0; i < numDir; i++) { //facing direction: left = 0, right = 1
			this.animations.push([]);
			for (var j = 0; j < numStates; j++) { //action
				this.animations[i].push([]);
			}
		}
		//idle
		this.animations[0][this.states.idle] = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, false, true, true);
		this.animations[1][this.states.idle] = new Animator(this.spritesheet, 8, 6, 21, 18, 2, 0.5, 3, false, true, false);

		//walk
		this.animations[0][this.states.walk] = new Animator(this.spritesheet, 8, 55, 23, 20, 10, 0.1, 0, false, true, true);
		this.animations[1][this.states.walk] = new Animator(this.spritesheet, 8, 55, 23, 20, 10, 0.1, 0, false, true, false);

		//run
		this.animations[0][this.states.run] = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true, true);
		this.animations[1][this.states.run] = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true, false);

		//jump
		this.animations[0][this.states.jump] = new Animator(this.spritesheet, 7, 131, 23.5, 22, 10, 0.1, 1.5, false, false, true);
		this.animations[1][this.states.jump] = new Animator(this.spritesheet, 7, 131, 23.5, 22, 10, 0.1, 1.5, false, false, false);

		//falling
		this.animations[0][this.states.falling] = new Animator(this.spritesheet, 233, 130, 23, 23, 1, 0.1, 0.1, false, true, true);
		this.animations[1][this.states.falling] = new Animator(this.spritesheet, 233, 130, 23, 23, 1, 0.1, 0.1, false, true, false);

		//jump kick
		this.animations[0][this.states.jumpkick] = new Animator(this.spritesheet, 81, 426, 25, 27, 1, 0.35, 3, false, false, true);
		this.animations[1][this.states.jumpkick] = new Animator(this.spritesheet, 81, 426, 25, 27, 1, 0.35, 3, false, false, false);

		//punch
		this.animations[0][this.states.attack] = new Animator(this.spritesheet, 7, 310, 37, 22, 7, 0.1, 1.5, false, false, true);
		this.animations[1][this.states.attack] = new Animator(this.spritesheet, 7, 310, 37, 22, 7, 0.1, 1.5, false, false, false);

		//shoot
		this.animations[0][this.states.shoot] = this.idle;
		this.animations[1][this.states.shoot] = this.idle;

	};

	update() {
		const TICK = this.game.clockTick;
		const SCALER = 3;

		//currently using Chris Marriot's mario physics
		const MIN_WALK = 4.453125 * SCALER;
		const MAX_WALK = 93.75 * SCALER;
		const MAX_RUN = 153.75 * SCALER;
		const ACC_WALK = 133.59375 * SCALER;
		const ACC_RUN = 200.390625 * SCALER;
		const DEC_REL = 182.8125 * SCALER;
		const DEC_SKID = 365.625 * SCALER;
		const MIN_SKID = 33.75 * SCALER;
		const ROLL_SPD = 400 * SCALER;
		const DOUBLE_JUMP_X_BOOST = 10;


		const STOP_FALL = 1575;
		const WALK_FALL = 1800;
		const RUN_FALL = 2025;
		const STOP_FALL_A = 450;
		const WALK_FALL_A = 421.875;
		const RUN_FALL_A = 562.5;
		const JUMP_HEIGHT = 1500;
		const DOUBLE_JUMP_HEIGHT = 200;


		const MAX_FALL = 270 * SCALER;

		if (this.action != this.states.jump) {
			this.velocity.x = 0;

			if (this.game.right && !this.game.attack) { //run right
				this.facing = this.dir.right;
				this.action = this.states.walk;

				this.velocity.x += MAX_RUN;
			} else if (this.game.left && !this.game.attack) { //run left
				this.facing = this.dir.left;
				this.action = this.states.walk;

				this.velocity.x -= MAX_RUN;
			} else { //idle
				this.action = this.DEFAULT_ACTION;
			}

			//jump press
			if (this.game.jump && !this.action.jump) {
				this.action = this.states.jump; //jump (9-11)
				//set jump distance
				this.velocity.y -= JUMP_HEIGHT;
				this.game.jump = false;
				this.inAir = true;
			}

		} else { //air physics
			// horizontal physics
			if (this.game.right && !this.game.left) {
				if (Math.abs(this.velocity.x) > MAX_WALK) {
					this.velocity.x += ACC_RUN * TICK;
				} else this.velocity.x += ACC_WALK * TICK;
			} else if (this.game.left && !this.game.right) {
				if (Math.abs(this.velocity.x) > MAX_WALK) {
					this.velocity.x -= ACC_RUN * TICK;
				} else this.velocity.x -= ACC_WALK * TICK;
			} else {
				// do nothing
			}
		}

		//attack
		//attack logic
		if (this.game.attack) {

			if (this.inAir) { //crouch attack
				this.action = this.states.jumpkick
			} else { //regular attack
				this.action = this.states.attack;
			}

			let done = this.animations[this.facing][this.action].isDone();
			//console.log(this.action + " " + this.game.comboCounter + " " + this.combo);

			if (done) {
				this.action = this.DEFAULT_ACTION;
				this.game.attack = false; //stop attackin
			}

		} else {
			this.resetAnimationTimers(this.states.attack);
            this.resetAnimationTimers(this.states.jumpkick);
		}



		//constant falling velocity
		this.velocity.y += this.fallAcc * TICK;


		// max y velocity
		if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
		if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

		//max x velocity
		let doubleJumpBonus = 0;
		if (!this.doubleJump) doubleJumpBonus = DOUBLE_JUMP_X_BOOST;
		if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN + doubleJumpBonus;
		if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN - doubleJumpBonus;

		//update position and bounding box
		this.x += this.velocity.x * TICK;
		this.y += this.velocity.y * TICK;
		this.updateBB();


		//reset position if outside the canvas. Temporary solution!
		//reset loop
		if (this.x > 1024 || this.x < 0) {
			this.x = 0;
			this.y = this.groundLevel;
		}

	        //do collisions detection here
			let that = this;
			this.game.entities.forEach(function (entity) {
	
				//buffers for collision placement
				let groundBuffer = 100;
				let bonkBuffer = 15;
				if (entity.BB && that.BB.collide(entity.BB)) {
					if (that.velocity.y > 0) { // falling
						if ((entity instanceof Ground || entity instanceof Platform) // landing
							&& (that.lastBB.bottom) >= entity.BB.top) { // was above last tick
							//console.log("touched grass");
							that.y = entity.BB.top - that.height;
	
							//touched ground so reset all jumping properties
							that.inAir = false;
							that.doubleJump = true;
							if (that.action == that.states.jump || that.action == that.states.jump_to_fall || that.action == that.states.falling) {
								that.action = that.DEFAULT_ACTION// set state to idle
							}
	
	
						}

						that.resetAnimationTimers(that.states.jump);
                        that.resetAnimationTimers(that.states.falling);
	
						that.velocity.y === 0;
						that.updateBB();
					}
	
	
					//jumping
					if(that.velocity.y < 0) {
	
						if((entity instanceof Ground || entity instanceof Platform)
						&& (that.lastBB.top <= entity.BB.bottom)) { //hit from bottom
							that.velocity.y = 0;
							that.y = entity.BB.top + bonkBuffer;
						}
	
						
					}
				}
	
	
			});	

		

	};

	//reset the animation timer in both direction
	resetAnimationTimers(action) {
		this.animations[0][action].elapsedTime = 0;
		this.animations[1][action].elapsedTime = 0;
	}

	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
	};



	draw(ctx) {
		//draw the full spreadsheet
		//ctx.drawImage(ASSET_MANAGER.getAsset("./kirby_walk.png"), 0, 50);
		//this.viewAll(ctx);

		this.animations[this.facing][this.action].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaling);

		if (PARAMS.DEBUG) {
			//console.log("here");
			this.viewBoundingBox(ctx);
        }
	};

	viewBoundingBox(ctx) { //debug
        ctx.strokeStyle = "Red";
		//console.log(this.BB.x + " " + this.BB.y + " " +  this.BB.width + " " +  this.BB.height);
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        //ctx.strokeStyle = "Green";
        //if (this.HB != null) ctx.strokeRect(this.HB.x, this.HB.y, this.HB.width, this.HB.height);
    }

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
}