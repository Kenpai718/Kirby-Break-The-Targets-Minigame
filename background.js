class Background { 
    constructor(game) {
        Object.assign(this, { game});

        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/background.png");
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/background.png");
        this.scale = 3;
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
    };
};