/**
 * Modified textbox for the scene manager to always draw on canvas
 * Dynamically makes the width and height based on passed in lines of text
 * It is expected that the passed in text is already spliced in an array where
 * each index is a new line string.
 */
class Sign {
    constructor(game) {
        Object.assign(this, { game });

        this.goSign = ASSET_MANAGER.getAsset("./sprites/go.png");
        this.completeSign = ASSET_MANAGER.getAsset("./sprites/complete.png");
        this.show = true;

        this.elapsed = 0;
        this.myOpacity = 100;
        this.myShowTime = 1;

    };

    isFinished() {
        return this.elapsed > this.myShowTime && this.myOpacity <= 0;
    }

    reset() {
        this.elapsed = 0;
        this.myOpacity = 100;
        this.show = true;
    }


    draw(ctx, type) {
        this.elapsed += this.game.clockTick;
        if (this.elapsed >= this.myShowTime) this.show = false;

        if(this.show) {
            if(type == 0) ctx.drawImage(this.goSign, 0, 0);
            else ctx.drawImage(this.completeSign, 0, 0)
        }

        if(!this.show && this.elapsed >= this.myShowTime) {
            if(this.myOpacity > 0) this.myOpacity--;

            ctx.filter = "Opacity(" + this.myOpacity + "%)";
            if(type == 0) ctx.drawImage(this.goSign, 0, 0);
            else ctx.drawImage(this.completeSign, 0, 0)
            ctx.filter = "none";
        } 
    };
}