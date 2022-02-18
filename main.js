const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//queue downloads
ASSET_MANAGER.queueDownload("./sprites/kirby_spritesheet.png");
ASSET_MANAGER.queueDownload("./sprites/cupid_kirby_spritesheet.png");
ASSET_MANAGER.queueDownload("./sprites/bronto_flip.png");
ASSET_MANAGER.queueDownload("./sprites/arrow.png");
ASSET_MANAGER.queueDownload("./sprites/targets.png");

//bg
ASSET_MANAGER.queueDownload("./sprites/environment/backgrounds.png");
ASSET_MANAGER.queueDownload("./sprites/environment/backgrounds2.png");
ASSET_MANAGER.queueDownload("./sprites/environment/hills.png");
ASSET_MANAGER.queueDownload("./sprites/environment/dark_castle_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/kirby_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/ground_tiles.png");


//music
ASSET_MANAGER.queueDownload("./music/break_the_targets_melee.mp3");

//sfx
ASSET_MANAGER.queueDownload(SFX.PING);
ASSET_MANAGER.queueDownload(SFX.BONUS);
ASSET_MANAGER.queueDownload(SFX.POYO);
ASSET_MANAGER.queueDownload(SFX.SHOOT);
ASSET_MANAGER.queueDownload(SFX.JUMP);
ASSET_MANAGER.queueDownload(SFX.CLICK);
ASSET_MANAGER.queueDownload(SFX.GO);
ASSET_MANAGER.queueDownload(SFX.GAME);
ASSET_MANAGER.queueDownload(SFX.RECORD);


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//auto replay music
	ASSET_MANAGER.autoRepeat("./music/break_the_targets_melee.mp3");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
