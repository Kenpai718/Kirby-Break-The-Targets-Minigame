class Arrow {
    constructor(game, x, y, target, towerTeam, heatSeeking) {
        Object.assign(this, { game, x, y, target });
        this.radius = 15;
        this.smooth = false;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/arrow.png");

        var dist = distance(this, this.target);
        this.maxSpeed = 1000; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];

        this.animations = [];
        this.animations.push(new Animator(this.spritesheet, 0, 0, 32, 32, 1, 0.2, 0, false, true)); //up
        this.animations.push(new Animator(this.spritesheet, 40, 0, 32, 32, 1, 0.2, 0, false, true)); //up right
        this.animations.push(new Animator(this.spritesheet, 80, 0, 32, 32, 1, 0.2, 0, false, true)); //right
        this.animations.push(new Animator(this.spritesheet, 120, 0, 32, 32, 1, 0.2, 0, false, true)); //down right
        this.animations.push(new Animator(this.spritesheet, 160, 0, 32, 32, 1, 0.2, 0, false, true)); //down

        this.facing = 5;
        this.scale = 3;

        this.elapsedTime = 0;

        this.myCombo = 0;
        this.scoreBoard = this.game.myScoreBoard;
    };

    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;


        if (!this.cache[angle]) {
            let radians = angle / 360 * 2 * Math.PI;
            let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = 32;
            offscreenCanvas.height = 32;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(16, 16);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-16, -16);
            offscreenCtx.drawImage(this.spritesheet, 80, 0, 32, 32, 0, 0, 32, 32);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
        var xOffset = 16;
        var yOffset = 16;

        ctx.drawImage(this.cache[angle], this.x - xOffset, this.y - yOffset);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
        }
    };

    update() {

        this.x += (this.velocity.x * this.game.clockTick);
        this.y += (this.velocity.y * this.game.clockTick);

        this.facing = getFacing(this.velocity);

        //handles hitting a target and updating the score
        for (var i = 0; i < this.game.targets.length; i++) {
            var ent = this.game.targets[i];
            if (ent instanceof Target && collide(this, ent)) {
                if (!ent.hit) {
                    ent.hit = true; //so target cant be hit multiple times
                    ent.removeFromWorld = true;
                    ASSET_MANAGER.playAsset(SFX.PING);
                    this.game.addEntityToFront(new Score(this.game, ent, ent.getPoint()));

                    this.updateTargetScore(ent);

                }
            }
        }

        if (!this.removeFromWorld) this.checkDespawn();
    };

    updateTargetScore(theTarget) {
        this.scoreBoard.myNumHit++;
        this.scoreBoard.myPoints += (theTarget.getPoint())
        this.myCombo++;

    }

    checkDespawn() {
        if (this.x < -30 || this.x > this.game.surfaceWidth + 500 || this.y < -30 || this.y > this.game.surfaceHeight + 500) {
            this.removeFromWorld = true;
            //add max combo to scoreboard
            this.scoreBoard.myMaxCombo = Math.max(this.myCombo, this.scoreBoard.myMaxCombo);

            this.checkComboBonus();
        }
    }

    checkComboBonus() {
        if (this.myCombo > 1) {
            let player = this.game.camera.player;
            let comboBonus = COMBO_BONUS * this.myCombo;
            this.scoreBoard.myPoints += comboBonus;
            this.game.addEntityToFront(new Score(this.game, player, comboBonus, true, this.myCombo));
        }
        
    }

    draw(ctx) {
        var xOffset = 16 * this.scale;
        var yOffset = 16 * this.scale;
        if (this.smooth) {
            let angle = Math.atan2(this.velocity.y, this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);

            this.drawAngle(ctx, degrees);
        } else {
            if (this.facing < 5) {
                this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - xOffset, this.y - yOffset, this.scale);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.animations[8 - this.facing].drawFrame(this.game.clockTick, ctx, -(this.x) - (32 * this.scale) + xOffset, this.y - yOffset, this.scale);
                ctx.restore();
            }
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
        }
    };


};