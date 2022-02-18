class Bronto {
	constructor(game) {
		this.game = game;
		//{spritesheet, xStart, yStart, width, height, frameCount, frameDuration}
		this.animator = new Animator(ASSET_MANAGER.getAsset("./bronto_flip.png"), 0, 0, 39, 38, 5, 0.1);

		//variables to adjust position and movement speed
		this.speed = 100;
		this.x = 1024;
		this.y = 30;
	};

	update() {
		//make it move backwards
		this.x -= this.speed*this.game.clockTick;
		//reset loop
		if(this.x < -120) {
			this.x = 1024;
		}

		
	};

	draw(ctx) {
		//draw the full spreadsheet
		//ctx.drawImage(ASSET_MANAGER.getAsset("./kirby_walk.png"), 0, 50);

		//flip it so it moves to the right

		//call animator to draw it
		this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
		
	};
}