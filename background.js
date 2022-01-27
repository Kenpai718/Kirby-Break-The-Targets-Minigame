class Background { 
    constructor(game) {
        Object.assign(this, { game});
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/backgrounds.png");
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/backgrounds2.png");
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/environment/hills.png");
        this.scale = 4;

        //choose location of picture

        //dedede's castle from backgrounds.png
        // this.x = 2;
        // this.y = 2;
        // this.width = 512;
        // this.height = 192;
        // this.offset = 180;

        //grassy mountain bg from background2.png
        // this.x = 1;
        // this.y = 1810;
        // this.width = 257;
        // this.height = 193;

        this.x = 0;
        this.y = 0;
        this.width = 256;
        this.height = 208;
        this.offset = 0;

    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x + this.offset, this.y, this.width, this.height, 0, 0, this.width * this.scale, this.height * this.scale);
    };
};