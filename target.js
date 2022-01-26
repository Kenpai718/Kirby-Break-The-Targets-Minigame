class Target {
	constructor(game) {
		this.game = game;
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/targets.png");

		//variables to adjust position and movement speed
		this.speed = 100;
		this.x = Math.floor(Math.random() * this.game.surfaceWidth);
		this.y = Math.floor(Math.random() * this.game.surfaceHeight);

		this.scale = 0.3;
		this.radius = 106 * this.scale;
		this.hit = false;


		this.velocity = { x: 0, y: 0 };
		this.speed = 10;

		this.behavior = Math.floor(Math.random() * 4); //0 = left, 1 = right, 2 = up, 3 = down
		this.color = Math.floor(Math.random() * 5);

		this.animations = [];
		this.animations.push(new Animator(this.spritesheet, 19, 0, 230, 230, 1, 1, 0, false, true)); //blue = 0
		this.animations.push(new Animator(this.spritesheet, 260, 0, 230, 230, 1, 1, 0, false, true)); //green = 1
		this.animations.push(new Animator(this.spritesheet, 490, 0, 230, 230, 1, 1, 0, false, true)); //yellow = 2
		this.animations.push(new Animator(this.spritesheet, 745, 0, 230, 230, 1, 1, 0, false, true)); //orange = 3
		this.animations.push(new Animator(this.spritesheet, 980, 0, 230, 230, 1, 1, 0, false, true)); //red = 4

	};

	update() {

		const TICK = this.game.clockTick;
		const MAX_SPD = 300;
		let bounce = 50;


		if (this.x < 0 || this.x > this.game.surfaceWidth || this.y < 0 || this.y > this.game.surfaceHeight) {
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
		}

		switch (this.behavior) {
			case (0):
				this.velocity.x -= this.speed;
				break;
			case (1):
				this.velocity.x += this.speed;
				break;
			case (2):
				this.velocity.y -= this.speed;
				break;
			case (3):
				this.velocity.y += this.speed;
				break;
		}

		//update position and bounding box
		this.x += (this.velocity.x * TICK);
		this.y += (this.velocity.y * TICK);

		if (this.velocity.y >= MAX_SPD) this.velocity.y = MAX_SPD;
		if (this.velocity.y <= -MAX_SPD) this.velocity.y = -MAX_SPD;
		if (this.velocity.x >= MAX_SPD) this.velocity.x = MAX_SPD
		if (this.velocity.x <= -MAX_SPD) this.velocity.x = -MAX_SPD;


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