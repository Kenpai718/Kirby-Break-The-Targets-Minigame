class Target {
	constructor(game) {
		this.game = game;
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/targets.png");

		//variables to adjust position and movement speed
		//in range is (max - min) *min
		this.x = Math.floor(Math.random() * this.game.surfaceWidth);
		this.y = Math.floor(Math.random() * this.game.surfaceHeight);

		this.scale = 0.3;
		this.radius = 106 * this.scale;
		this.hit = false;
		this.myDirection = "none";
		this.point = 1;
		this.speedScalar = 100; //increase the set speeds


		this.velocity = { x: 0, y: 0 };
		//to make it easier to identify index of animation array
		this.colorType = { blue: 0, green: 1, yellow: 2, orange: 3, red: 4 };

		this.color = Math.floor(Math.random() * 5);

		this.animations = [];
		this.animations.push(new Animator(this.spritesheet, 19, 0, 230, 230, 1, 1, 0, false, true)); //blue = 0
		this.animations.push(new Animator(this.spritesheet, 260, 0, 230, 230, 1, 1, 0, false, true)); //green = 1
		this.animations.push(new Animator(this.spritesheet, 490, 0, 230, 230, 1, 1, 0, false, true)); //yellow = 2
		this.animations.push(new Animator(this.spritesheet, 745, 0, 230, 230, 1, 1, 0, false, true)); //orange = 3
		this.animations.push(new Animator(this.spritesheet, 980, 0, 230, 230, 1, 1, 0, false, true)); //red = 4

		this.setBehavior();
	};

	setBehavior() {
		switch (this.color) {
			case this.colorType.red: //stays still
				this.setSpeeds(0, 0);
				this.point = 1;
				break;
			case this.colorType.orange: //slow speed
				this.setSpeeds(1, 4);
				this.point = 2;
				break;
			case this.colorType.yellow: //medium speed
				this.setSpeeds(4, 7);
				this.point = 3;
				break;
			case this.colorType.green: //fast speed
				this.setSpeeds(7, 10);
				this.point = 4;
				break;
			case this.colorType.blue: //very fast
				this.setSpeeds(9, 13);
				this.point = 5;
				break;
		}

		this.setDirAndSpeed(); //set initial direction and speed
	}

	setSpeeds(theMin, theMax) {
		this.myMinSpd = theMin;
		this.myMaxSpd = theMax;
	}

	getPoint() {
		return this.point;
	}

	setDirAndSpeed() {
		this.behavior = randomInt(4); //0 = left, 1 = right, 2 = up, 3 = down
		this.speed = getRandomIntInRange(this.myMinSpd, this.myMaxSpd); //in range is (max - min) *min
		switch (this.behavior) {
			case (0):
				this.direction = "left";
				this.velocity.x = -this.speed;
				break;
			case (1):
				this.direction = "right";
				this.velocity.x = this.speed;
				break;
			case (2):
				this.direction = "up";
				this.velocity.y = -this.speed;
				break;
			case (3):
				this.direction = "down";
				this.velocity.y = -this.speed;
				break;
		}

	}

	getColor() {
		let color = "red";
		switch (this.color) {
			case this.colorType.orange:
				color = "orange";
				break;
			case this.colorType.yellow:
				color = "yellow";
				break;
			case this.colorType.green:
				color = "springgreen";
				break;
			case this.colorType.blue:
				color = "aqua";
				break;
		}

		return color;
	}

	update() {

		const TICK = this.game.clockTick;
		const MAX_SPD = 300;

		this.checkIfReverse();

		this.x += (this.velocity.x * this.speedScalar) * TICK;
		this.y += (this.velocity.y * this.speedScalar) * TICK;

	};

	/**
	 * Hit edge reverse direction
	 */
	checkIfReverse() {
		// bottom bound / floor
		if (this.y + this.radius >= this.game.surfaceHeight) {
			this.velocity.y = -this.velocity.y;
			this.y = this.game.surfaceHeight - this.radius;
			this.direction = "up";
		}
		// top bound / ceiling
		if (this.y - this.radius <= 0) {
			this.velocity.y = -this.velocity.y;
			this.y = this.radius;
			this.direction = "down";
		}

		// left bound
		if (this.x - this.radius <= 0) {
			this.velocity.x = -this.velocity.x;
			this.x = this.radius;
			this.direction = "right";
		}
		// right bound
		if (this.x + this.radius >= this.game.surfaceWidth) {
			this.velocity.x = -this.velocity.x;
			this.x = this.game.surfaceWidth - this.radius;
			this.direction = "left";
		}
	}


	draw(ctx) {
		//draw the full spreadsheet
		//ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/targets.png"), 980, 0, 230, 230, this.x, this.y, this.width, this.height);

		if (!this.hit) {
			//offset it by the radius because it is a circle
			this.animations[this.color].drawFrame(this.game.clockTick, ctx, this.x - this.radius, this.y - this.radius, this.scale);
		}


		if (PARAMS.DEBUG) {
			ctx.strokeStyle = "Red";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.stroke();

			//debug text
			ctx.font = "25px Arial";
			ctx.fillStyle = "red";
			let xy = ("(" + Math.round(this.x) + ", " + Math.round(this.y) + ")");
			let fSize = 25;
			ctx.fillText("Type: " + this.color + ", " + this.direction, this.x + this.radius + 5, this.y);
			ctx.fillText(xy, this.x + this.radius + 5, this.y + fSize);
			ctx.fillText("Speed: " + this.speed, this.x + this.radius + 5, this.y + fSize * 2);
		}

	};


}