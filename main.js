const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//queue downloads
ASSET_MANAGER.queueDownload("./sprites/kirby_spritesheet.png");
ASSET_MANAGER.queueDownload("./sprites/cupid_kirby_spritesheet.png");
ASSET_MANAGER.queueDownload("./sprites/bronto_flip.png");
ASSET_MANAGER.queueDownload("./sprites/environment/background.png");
ASSET_MANAGER.queueDownload("./sprites/environment/dark_castle_tileset.png");
ASSET_MANAGER.queueDownload("./sprites/environment/kirby_tileset.png");

//music
ASSET_MANAGER.queueDownload("./music/KirbyOST.mp3");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;



	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
