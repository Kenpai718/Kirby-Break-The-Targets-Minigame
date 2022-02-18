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
ASSET_MANAGER.queueDownload("./sound/hitsound.wav");
ASSET_MANAGER.queueDownload("./sound/bonus.mp3");
ASSET_MANAGER.queueDownload("./sound/poyo.mp3");
ASSET_MANAGER.queueDownload("./sound/shoot.wav");
ASSET_MANAGER.queueDownload("./sound/jump.wav");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//auto replay music
	ASSET_MANAGER.autoRepeat("./music/break_the_targets_melee.mp3");
	ASSET_MANAGER.forcePlayMusic("./music/break_the_targets_melee.mp3");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
