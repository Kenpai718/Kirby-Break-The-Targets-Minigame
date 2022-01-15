class Background { 
    constructor(game) {
        Object.assign(this, { game});

        this.spritesheet = ASSET_MANAGER.getAsset("./background.png");
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 1024, 768);
    };
};