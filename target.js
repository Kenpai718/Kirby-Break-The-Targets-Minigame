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


		this.velocity = { x: 0, y: 0 };
		this.setDirAndSpeed(); //set initial direction and speed
		this.color = Math.floor(Math.random() * 5);

		this.animations = [];
		this.animations.push(new Animator(this.spritesheet, 19, 0, 230, 230, 1, 1, 0, false, true)); //blue = 0
		this.animations.push(new Animator(this.spritesheet, 260, 0, 230, 230, 1, 1, 0, false, true)); //green = 1
		this.animations.push(new Animator(this.spritesheet, 490, 0, 230, 230, 1, 1, 0, false, true)); //yellow = 2
		this.animations.push(new Animator(this.spritesheet, 745, 0, 230, 230, 1, 1, 0, false, true)); //orange = 3
		this.animations.push(new Animator(this.spritesheet, 980, 0, 230, 230, 1, 1, 0, false, true)); //red = 4

	};

	setDirAndSpeed() {
		this.behavior = Math.floor(Math.random() * 4); //0 = left, 1 = right, 2 = up, 3 = down
		this.speed = Math.floor(Math.random() * (10 - 1) + 1); //in range is (max - min) *min
		switch (this.behavior) {
			case (0):
				this.velocity.x = -this.speed;
				break;
			case (1):
				this.velocity.x = this.speed;
				break;
			case (2):
				this.velocity.y = -this.speed;
				break;
			case (3):
				this.velocity.y = -this.speed;
				break;
		}

	}

	update() {

		const TICK = this.game.clockTick;
		const MAX_SPD = 300;

		// bottom bound / floor
		if (this.y + this.radius >= this.game.surfaceHeight) {
			this.velocity.y = -this.velocity.y;
			this.y = this.game.surfaceHeight - this.radius;
		}
		// top bound / ceiling
		if (this.y - this.radius <= 0) {
			this.velocity.y = -this.velocity.y;
			this.y = this.radius;
		}

		// left bound
		if (this.x - this.radius <= 0) {
			this.velocity.x = -this.velocity.x;
			this.x = this.radius;
		}
		// right bound
		if (this.x + this.radius >= this.game.surfaceWidth) {
			this.velocity.x = -this.velocity.x;
			this.x = this.game.surfaceWidth - this.radius;
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;

	};

	reverse() {
		let bounce = this.radius * 2;
		if (this.behavior == 0) { //left out
			this.x += bounce;
			this.behavior = 1;
		} else if (this.behavior == 1) { //right
			this.x -= bounce;
			this.behavior = 0;
		} else if (this.behavior == 2) { //up
			this.y += bounce;
			this.behavior = 3;
		} else { //down
			this.y -= bounce;
			this.behavior = 2;
		}
	};


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
			let xy = ("(" + this.x + ", " + this.y + ")");
			ctx.fillText(xy, this.x + this.radius, this.y + this.radius);
			ctx.fillText("Speed: " + this.speed, this.x + this.radius, this.y + this.radius + 10);
			ctx.fillText("Hit: " + this.hit, this.x + this.radius, this.y + this.radius + 20);
			
		}

	};

	// collide(A, B) {

	// 	console.log("called here");

	// 	let Ax = A.x;
	// 	let Ay = A.y;
	// 	let Bx = B.x;
	// 	let By = B.y;

	// 	//correction offset
	// 	if(A instanceof Target) Ax += A.radius; Ay += A.radius;
	// 	if(B instanceof Target) Bx += B.radius; By += B.radius;

	// 	let dist = Math.sqrt((Bx - Ax) * (Bx - Ax) + (By - Ay)*(By - Ay));
	// 	return (dist < A.radius + B.radius);
	// };


}