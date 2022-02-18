// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.targets = [];
        this.environment = [];
        this.background = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;

        //controls
        this.left = null;
        this.right = null;
        this.down = null;
        this.up = null;
        this.jump = null;
        this.attack = null;

        //stats
        this.myScoreBoard = new ScoreBoard(this);

        // this.keys = {};


        //height for debug
        this.surfaceWidth = null;
        this.surfaceHeight = null;

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;

        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        var that = this;
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });


        //mouse was clicked
        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }

            this.click = getXandY(e);

            //set attack
            switch (e.which) {
                case 1:
                    //alert('Left Mouse button pressed.');
                    that.attack = true;
                    that.myScoreBoard.myNumShots++;
                    break;
                case 2:
                    //alert('Middle Mouse button pressed.');
                    break;
                case 3:
                    //alert('Right Mouse button pressed.');
                    break;

            }


        });

        //release mouse click
        this.ctx.canvas.addEventListener("mouseup", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }

            this.click = getXandY(e);

            switch (e.which) {
                case 1:
                    //alert('Left Mouse button release.');
                    break;
                case 2:
                    //alert('Middle Mouse button release.');
                    break;
                case 3:
                    //alert('Right Mouse button release.');
                    break;

            }


        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
        });

        //keyboard press control logic
        this.ctx.canvas.addEventListener("keydown", function (e) {
            e.preventDefault(); //prevent scrolling from pressing a key
            switch (e.key) {
                case "d":
                    that.right = true;
                    break;
                case "a":
                    that.left = true;
                    break;
                case "s":
                    that.down = true;
                    break;
                case "w":
                    that.up = true;
                    break;
                case "p":
                    that.attack = true;
                    break;
                case " ":
                    that.jump = true;
                    break;
            }
        }, false);

        //keyboard release control logic
        this.ctx.canvas.addEventListener("keyup", function (e) {
            switch (e.key) {
                case "d":
                    that.right = false;
                    break;
                case "a":
                    that.left = false;
                    break;
                case "s":
                    that.down = false;
                    break;
                case "w":
                    that.up = false;
                    break;
            }
        }, false);

        // window.addEventListener("keydown", event => this.keys[event.key] = true);
        // window.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        if (entity instanceof Target) this.targets.push(entity);
        else if (entity instanceof Ground) this.environment.push(entity);
        else if (entity instanceof Background) this.background.push(entity);
        else this.entities.push(entity);
    };

    addEntityToFront(entity) {
        if (entity instanceof Target) this.targets.unshift(entity);
        else if (entity instanceof Ground) this.environment.unshift(entity);
        else if (entity instanceof Background) this.background.unshift(entity);
        else this.entities.unshift(entity);
    };


    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.background.length - 1; i >= 0; i--) {
            this.background[i].draw(this.ctx, this);
        }

        for (let i = this.environment.length - 1; i >= 0; i--) {
            this.environment[i].draw(this.ctx, this);
        }

        for (let i = this.targets.length - 1; i >= 0; i--) {
            this.targets[i].draw(this.ctx, this);
        }

        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }



        //update the camera (scene manager)
        this.camera.draw(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;

        this.updateLayer(this.background);
        this.updateLayer(this.environment);
        this.updateLayer(this.entities);
        this.updateLayer(this.targets);

        this.removeFromLayer(this.background);
        this.removeFromLayer(this.environment);
        this.removeFromLayer(this.entities);
        this.removeFromLayer(this.targets);


        //update the camera (scene manager)
        this.camera.update();
    };

    updateLayer(layer) {
        let entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
    }

    removeFromLayer(layer) {
        for (let i = layer.length - 1; i >= 0; --i) {
            if (layer[i].removeFromWorld) {
                layer.splice(i, 1);
            }
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

    /**
* Clear a layer from entities list
* @param {} layer
*/
    clearLayer(layer) {
        layer.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    }

};

// KV Le was here :)
