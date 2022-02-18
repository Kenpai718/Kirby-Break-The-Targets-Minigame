class Debug {
	constructor(game, player) {
		this.game = game;


	};

	update() {

	};

	draw(ctx) {

		let xV = "xV=" + Math.floor(this.game.kirby.x);
		let yV = "yV=" + Math.floor(this.game.kirby.y);
		ctx.fillText(xV, 1.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
		ctx.fillText(yV, 1.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

		ctx.translate(0, -10); // hack to move elements up by 10 pixels instead of adding -10 to all y coordinates below
		ctx.strokeStyle = "White";
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.game.left ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(6 * PARAMS.BLOCKWIDTH - 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
		ctx.fillText("L", 6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
		ctx.strokeStyle = this.game.down ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
		ctx.fillText("D", 6.5 * PARAMS.BLOCKWIDTH + 2, 3.5 * PARAMS.BLOCKWIDTH + 2);
		ctx.strokeStyle = this.game.up ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(6.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH - 4, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
		ctx.fillText("U", 6.5 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2);
		ctx.strokeStyle = this.game.right ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeRect(7 * PARAMS.BLOCKWIDTH + 2, 2.5 * PARAMS.BLOCKWIDTH - 2, 0.5 * PARAMS.BLOCKWIDTH + 2, 0.5 * PARAMS.BLOCKWIDTH + 2);
		ctx.fillText("R", 7 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

		ctx.strokeStyle = this.game.A ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();
		ctx.arc(8.25 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillText("A", 8 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);
		ctx.strokeStyle = this.game.B ? "White" : "Grey";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();
		ctx.arc(9 * PARAMS.BLOCKWIDTH + 2, 2.75 * PARAMS.BLOCKWIDTH, 0.25 * PARAMS.BLOCKWIDTH + 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillText("B", 8.75 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

		ctx.translate(0, 10);
		ctx.strokeStyle = "White";
		ctx.fillStyle = ctx.strokeStyle;

	};
}