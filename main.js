const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//queue downloads
ASSET_MANAGER.queueDownload("./kirby_spritesheet.png");
ASSET_MANAGER.queueDownload("./bronto_flip.png");
ASSET_MANAGER.queueDownload("./background.png");

//music
ASSET_MANAGER.queueDownload("./KirbyOST.mp3");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;


	//music
	ASSET_MANAGER.autoRepeat("./KirbyOST.mp3");


	//make starting game entities here
	gameEngine.addEntity(new Kirby(gameEngine));
	gameEngine.addEntity(new Bronto(gameEngine));
	gameEngine.addEntity(new Background(gameEngine));

	ASSET_MANAGER.pauseBackgroundMusic();
	ASSET_MANAGER.playAsset("./KirbyOST.mp3");


	gameEngine.init(ctx);
	gameEngine.start();
});
