class Debug {
	constructor(game, player) {
		this.game = game;


	};

	update() {

	};

	draw(ctx) {
		//keyboard input

		ctx.font = PARAMS.DEFAULT_FONT;

		// left debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.left ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(10, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("A", 20, this.game.surfaceHeight - 20);

		// down debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.down ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(50, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("S", 60, this.game.surfaceHeight - 20);

		// up debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.up ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(50, this.game.surfaceHeight - 80, 30, 30);
		ctx.fillText("W", 60, this.game.surfaceHeight - 60);

		// right debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.right ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(90, this.game.surfaceHeight - 40, 30, 30);
		ctx.fillText("D", 100, this.game.surfaceHeight - 20);

		// jump debug
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.jump ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(130, this.game.surfaceHeight - 40, 75, 30);
		ctx.fillText("SPACE", 140, this.game.surfaceHeight - 20);

		// shoot debug

		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.attack ? "Red" : "SpringGreen";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(270, this.game.surfaceHeight - 40, 60, 30);
		ctx.fillText("Shoot", 275, this.game.surfaceHeight - 20);



	}
}