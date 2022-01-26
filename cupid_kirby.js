class CupidKirby {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		//starts with a walking animation
		//this.animator = new Animator(ASSET_MANAGER.getAsset("./kirby_spritesheet.png"), 1.01, 0, 23, 24, 10, 0.1);
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/cupid_kirby_spritesheet.png");
		//animation params: img, starting x on spritesheet, starting y, width, height on spritesheet, frame count, frame speed, frame padding, reverse?, loop?

		//some animations to be used
		this.wait = new Animator(this.spritesheet, 0, 0, 25, 23, 2, 0.5, 5, false, true, false);
		this.walk = new Animator(this.spritesheet, 2, 133, 26, 27, 10, 0.1, 4, false, true, false);
		this.jump = new Animator(this.spritesheet, 0, 32, 29.5, 26, 8, 0.1, 0, false, true, false);
		this.falling = new Animator(this.spritesheet, 209, 29, 29, 27, 6, 0.1, 0, false, true, false);
		this.flying = new Animator(this.spritesheet, 0, 61, 30, 29, 9, 0.1, 0, false, true, false);
		this.ground_shoot = new Animator(this.spritesheet, 0, 95, 36, 35, 7, 0.1, 2, false, true, false);
		this.air_shoot = new Animator(this.spritesheet, 269, 61, 38, 33, 6, 0.1, 0, false, true, false);

		//this.idle = new Animator(this.spritesheet, 9, 244, 27.5, 22, 11, 0.15, 0.1, false, true);


		this.dir = { left: 0, right: 1 };
		this.states = {
			idle: 0, walk: 1, jump: 2, falling: 3,
			flying: 4, ground_shoot: 5, air_shoot: 6
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
		this.flightMode = false;



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
		this.animations[0][this.states.idle] = new Animator(this.spritesheet, 0, 0, 25, 23, 2, 0.5, 5, false, true, true);
		this.animations[1][this.states.idle] = new Animator(this.spritesheet, 0, 0, 25, 23, 2, 0.5, 5, false, true, false);

		//walk
		this.animations[0][this.states.walk] = new Animator(this.spritesheet, 2, 133, 26, 27, 10, 0.1, 4, false, true, true);
		this.animations[1][this.states.walk] = new Animator(this.spritesheet, 2, 133, 26, 27, 10, 0.1, 4, false, true, false);

		//run
		this.animations[0][this.states.run] = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true, true);
		this.animations[1][this.states.run] = new Animator(this.spritesheet, 4.5, 108, 25.5, 22, 8, 0.1, 0.17, false, true, false);

		//jump
		this.animations[0][this.states.jump] = new Animator(this.spritesheet, 0, 32, 29.5, 26, 8, 0.1, 0, false, true, true);
		this.animations[1][this.states.jump] = new Animator(this.spritesheet, 0, 32, 29.5, 26, 8, 0.1, 0, false, true, false);

		//falling
		this.animations[0][this.states.falling] = new Animator(this.spritesheet, 209, 29, 29, 27, 6, 0.1, 0, false, true, true);
		this.animations[1][this.states.falling] = new Animator(this.spritesheet, 209, 29, 29, 27, 6, 0.1, 0, false, true, false);

		//ground shoot
		this.animations[0][this.states.ground_shoot] = new Animator(this.spritesheet, 0, 95, 36, 35, 7, 0.05, 2, false, false, true);
		this.animations[1][this.states.ground_shoot] = new Animator(this.spritesheet, 0, 95, 36, 35, 7, 0.05, 2, false, false, false);

		//air shoot
		this.animations[0][this.states.air_shoot] = new Animator(this.spritesheet, 269, 61, 38, 33, 6, 0.05, 0, false, false, true);
		this.animations[1][this.states.air_shoot] = new Animator(this.spritesheet, 269, 61, 38, 33, 6, 0.05, 0, false, false, false);

		//fly
		this.animations[0][this.states.flying] = new Animator(this.spritesheet, 0, 61, 30, 29, 9, 0.1, 0, false, true, true);
		this.animations[1][this.states.flying] = new Animator(this.spritesheet, 0, 61, 30, 29, 9, 0.1, 0, false, true, false);


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

		//make sure its not an action that should be interrupted
		if (this.action != this.states.jump && !this.inAir) {
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

			if (this.action == this.states.jump) {
				if (this.animations[0][this.states.jump].isDone() || this.animations[1][this.states.jump].isDone()) { //jump finished transition to falling
					this.action = this.states.falling;
					//console.log("transition jump here");
				}
			} else {
				this.resetAnimationTimers(this.states.jump);
			}

			if (this.game.jump && this.inAir && !this.flightMode) {
				//console.log("flight mode on");
				this.flightMode = true;
				this.game.jump = false;
				this.action = this.states.flying;
				this.resetAnimationTimers(this.states.jump);
			}

			if(this.flightMode && !this.game.jump) { //free movement
				this.action = this.states.flying;
				this.velocity.x = 0;
				this.velocity.y = 0;

				if(this.game.right && !this.game.left) {
					this.facing = this.dir.right;
					this.velocity.x += MAX_RUN;
				} else if(this.game.left && !this.game.right) {
					this.facing = this.dir.left;
					this.velocity.x -= MAX_RUN;
				}

				if(this.game.up && !this.game.down) {
					this.velocity.y -= MAX_RUN;
				} else if(this.game.down && !this.game.up) {
					this.velocity.y += MAX_RUN;
				}

			} else if(this.flightMode && this.game.jump && this.inAir) {
				this.action = this.states.falling;
				this.flightMode = false;
				this.velocity.y += WALK_FALL;
				this.game.jump = false;
				//console.log("flight mode off falling");
			}




		}

		//attack
		if (this.game.attack) {

			if (this.inAir) { //crouch attack
				this.action = this.states.air_shoot
			} else { //regular attack
				this.action = this.states.ground_shoot;
			}

			let done = this.animations[this.facing][this.action].isDone();
			//console.log(this.action + " " + this.game.comboCounter + " " + this.combo);

			if (done) {
				this.action = this.DEFAULT_ACTION;
				this.game.attack = false; //stop attackin

				//spawn the arrow
				this.game.addEntityToFront(new Arrow(this.game, this.x + this.width, this.y + this.height / 2, this.game.mouse));
			}

		} else {
			this.resetAnimationTimers(this.states.air_shoot);
			this.resetAnimationTimers(this.states.ground_shoot);
		}



		//constant falling velocity
		if(!this.flightMode) this.velocity.y += this.fallAcc * TICK;


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
		if (this.x > this.game.surfaceWidth || this.x < 0) {
			this.x = 0;
			this.y = this.y;
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
						that.flyingMode = false;
						if (that.action == that.states.jump || that.action == that.states.falling || that.action == that.states.flying) {
							that.action = that.DEFAULT_ACTION// set state to idle
							that.game.jump = false;
						}


					}

					that.resetAnimationTimers(that.states.jump);
					that.resetAnimationTimers(that.states.falling);

					that.velocity.y === 0;
					that.updateBB();
				}


				//jumping
				if (that.velocity.y < 0) {

					if ((entity instanceof Ground || entity instanceof Platform)
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
			ctx.strokeStyle = "SpringGreen";
			ctx.fillText("Action: " + this.action, 10, 30);
			ctx.fillText("Flight Mode: " + this.flightMode, 10, 40);
			ctx.fillText("In air: " + this.inAir, 10, 50);
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
		//this.waitFlip.drawFrame(this.game.clockTick, ctx, this.x, this.y - 50, this.scaling);
		this.walk.drawFrame(this.game.clockTick, ctx, this.x + 100, this.y, this.scaling);
		this.jump.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y, this.scaling);
		this.falling.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y - 100, this.scaling);
		this.flying.drawFrame(this.game.clockTick, ctx, this.x + 400, this.y, this.scaling);
		this.ground_shoot.drawFrame(this.game.clockTick, ctx, this.x + 500, this.y, this.scaling);
		this.air_shoot.drawFrame(this.game.clockTick, ctx, this.x + 600, this.y, this.scaling);

	}
}