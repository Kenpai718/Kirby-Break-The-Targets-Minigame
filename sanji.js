class Sanji {
	constructor(game) {
		this.game = game;
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		//starts with a walking animation
		//this.animator = new Animator(ASSET_MANAGER.getAsset("./kirby_walk.png"), 1.01, 0, 23, 24, 10, 0.1);
		this.spritesheet = ASSET_MANAGER.getAsset("./sanji.png");
		//animation params: img, starting x on spritesheet, starting y, width, height on spritesheet, frame count, frame speed, frame padding, reverse?, loop?
		var canvasX = 13;
		var canvasY = 17;
		var width = 26;
		var height = 52;
		var posX = 0;
		var posY = 0;

		this.animation = new Animator(this.spritesheet, 2, 294, 55, 50, 7, 0.5, 0, false, true);

		//variables to adjust position and movement speed
		this.speed = 150;
		this.x = -48;
		this.y = 0;
		this.run = false;

		var canvasX = 13;
		var canvasY = 17;
		var width = 26;
		var height = 52;
		var posX = 0;
		var posY = 0;

		var scaling = 3;
		
		//ctx.drawImage(this.spritesheet, canvasX, canvasY, width, height, posX, posY, width * scaling, height * scaling);
		
	};

	update() {
/* 		//make it move forward
		this.x += this.speed*this.game.clockTick;

		//start running after going one quarter the screen
		if(this.run == false && this.x > 348) {
			this.setRun();
		}
		
		//slowly increment the speed as kirby runs
		if(this.run) {
			this.speed += 5;
		}

		//reset loop
		if(this.x > 2048) {
			this.x = -96;
			this.setWalk();
		} */
	};

	draw(ctx) {
		//params for draw frame: tick, posX, posY, scaling
		this.animation.drawFrame(this.game.clockTick, ctx, 0, 0, 3);
	};
}