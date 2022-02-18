/**
 * Damage/healing score
 */
class Score {
    constructor(game, entity, score) {
        Object.assign(this, { game, entity, score });

        this.x = entity.x;
        this.y = entity.y - 10;
        this.myOpacity = 100;


        this.velocity = -32;
        this.elapsed = 0;
        console.log(this.x, this.y);
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) this.removeFromWorld = true;

        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {
        //fade out
        if (this.elapsed >= .5) {
            this.myOpacity--;
            ctx.filter = "opacity(" + this.myOpacity + "%)";
        }

        ctx.fillStyle = "Black";
        ctx.fillText(this.score, (this.x - 1) - this.game.camera.x, this.y - this.game.camera.y + 1);
        ctx.fillStyle = "Blue";
        ctx.fillText(this.score, (this.x ) - this.game.camera.x, this.y - this.game.camera.y);
        ctx.filter = "none";
    };

    drawDebug(ctx) {

    }
};