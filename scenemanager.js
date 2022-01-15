class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.x = 0;

		this.title = true;
		
		this.kirby = new this.kirby(this.game);

		
	};

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

	update() {

	};



	draw(ctx) {
		if (this.title) {
            var width = 176;
            var height = 88;
            ctx.fillStyle = this.game.mouse && this.game.mouse.y > 9 && this.game.mouse.y < 9.5 ? "Grey" : "White";
            ctx.fillText("Start", 6.75, 9.5);
        }
    
	};

	debug(ctx) {
		
	}
}