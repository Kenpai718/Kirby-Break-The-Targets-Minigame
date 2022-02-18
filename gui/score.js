/**
 * Damage/healing score
 */
class Score {
    constructor(game, entity, score) {
        Object.assign(this, { game, entity, score });

        this.x = entity.x;
        this.y = entity.y - 30;
        this.myOpacity = 100;


        this.velocity = -32;
        this.elapsed = 0;
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed >= .5) this.myOpacity--;
        if (this.myOpacity <= 0) this.removeFromWorld = true;


        this.y += this.game.clockTick * this.velocity;
    };

    draw(ctx) {
        //fade out
        ctx.filter = "opacity(" + this.myOpacity + "%)";

        let fontSize = (15 * this.score);
        if (fontSize > 50) fontSize = 50;
        ctx.font = fontSize + 'px "Press Start 2P"'

        ctx.fillStyle = "Black";
        ctx.fillText(this.score, (this.x - 1), this.y + 1);
        ctx.fillStyle = this.entity.getColor();
        ctx.fillText(this.score, this.x, this.y);
        ctx.filter = "none";
    };
};

/**
 * Reports all stats in game
 */
class ScoreBoard {
    constructor(game) {
        this.game = game;

        //player stats
        this.myNumHit = 0;
        this.myNumShots = 0;
        this.myAccuracy = 0;
        this.myPoints = 0;
        this.myMaxCombo = 0;
        this.myWave = 0;

        this.bonusMultiplier = 10;

        this.myHighScore = 0; //save this

        this.elapsed = 0;
        this.playCongrats = false;

        let boxX = 450;
        let boxY = 1020;
        this.myReportBox = new SceneTextBox(this.game, boxX, boxY, "");
    }

    reset() {
        this.setHighScore();
        this.myReportBox.show = false;
        this.playCongrats = false;
        this.myNumHit = 0;
        this.myNumShots = 0;
        this.myAccuracy = 0;
        this.myPoints = 0;
        this.myMaxCombo = 0;
        this.myWave = 0;
        this.elapsed = 0;
    }

    setHighScore() {
        this.myHighScore = Math.max(this.myPoints, this.myHighScore);
    }

    gotNewHighScore() {
        return this.myHighScore < this.myPoints;
    }

    calculateBonus() {
        this.myComboBonus = 10 * this.myMaxCombo;
        this.myAccuracyBonus = Math.round(100 * this.myAccuracy / 100);
        this.myWaveBonus = 10 * this.myWave;

        this.myPoints += (this.myComboBonus) + this.myAccuracyBonus + this.myWaveBonus;
    }

    update() {
        if (!this.game.camera.transition) {
            this.myAccuracy = ((this.myNumHit / this.myNumShots) * 100).toFixed(2);
        } else if (this.game.camera.transition) {
            this.elapsed += this.game.clockTick;
            if(this.gotNewHighScore() && (this.elapsed > 1.5) && !this.playCongrats) {
                this.playCongrats = true;
                ASSET_MANAGER.playAsset(SFX.RECORD);
            }
        }
    }

    draw(ctx) {
        this.drawScoreBoard(ctx);
    }

    drawReportCard(ctx) {
        let fontSize = 40;
        let finalMsg = (this.myPoints > this.myHighScore) ? "NEW HIGH SCORE!" : "No new record...";
        let labels = [
            "REPORT CARD",
            "[BONUSES]: ",
            "COMBOS:10*" + this.myMaxCombo + "= " + this.myComboBonus,
            "WAVES:10*" + this.myWave + "= " + this.myWaveBonus,
            "ACCURACY:10*" + (this.myAccuracy / 100).toFixed(2) + "= " + this.myAccuracyBonus,
            "",
            "FINAL RESULTS:",
            "TOTAL-POINTS= " + this.myPoints,
            "HIGH-SCORE  = " + this.myHighScore,
            "",
            finalMsg
        ]

        this.myReportBox.setMessage(labels, true);
        this.myReportBox.draw(ctx);
        //ctx.font = fontSize + 'px "Press Start 2P"';
        //this.drawLabelsLeft(ctx, labels, fontSize, "MidnightBlue");
    }

    drawScoreBoard(ctx) {
        let fontH = 20;
        ctx.font = fontH + 'px "Press Start 2P"';

        let labelsRight = [
            "High Score: " + this.myHighScore,
            "Max Combo: " + this.myMaxCombo,
            "Targets Hit: " + this.myNumHit,
            "Times Fired: " + this.myNumShots,
            "Accuracy: " + this.myAccuracy + "%",
        ];

        let labelsLeft = [
            "",
            "",
            "Wave #" + this.myWave,
            "Points: " + this.myPoints
        ]

        ctx.filter = "Opacity(50%)";
        this.drawLabelsRight(ctx, labelsRight, fontH, "lightseagreen");
        ctx.filter = "none";

        this.drawLabelsLeft(ctx, labelsLeft, fontH, "PaleVioletRed");

        //draw time top left BIG
        let time = Math.round(this.game.camera.myTimer);

        ctx.font = '60 px "Press Start 2P"';
        ctx.fillStyle = "black";
        ctx.fillText("Time Left: " + time, 11, 41);
        (time >= (DEFAULT_GAME_TIMER * .3)) ? ctx.fillStyle = "White" :
            (time >= (DEFAULT_GAME_TIMER * .1)) ? ctx.fillStyle = "Yellow" : ctx.fillStyle = "Red";
        ctx.fillText("Time Left: " + time, 10, 40);
    }

    drawLabelsRight(ctx, theLabels, fontSize, theColor) {
        ctx.align = "left";
        let buffer = 10;
        for (let i = 1; i <= theLabels.length; i++) {
            let label = theLabels[i - 1];
            let offset = getRightOffset(label, fontSize);
            let x = this.game.surfaceWidth - offset - buffer;

            ctx.fillStyle = "black";
            ctx.fillText(label, x + 1, (i * fontSize) + buffer + 1);
            ctx.fillStyle = theColor
            ctx.fillText(label, x, (i * fontSize) + buffer);
        }
    }

    drawLabelsLeft(ctx, theLabels, fontSize, theColor) {
        ctx.textAlign = "left";
        let buffer = 10;
        for (let i = 1; i <= theLabels.length; i++) {
            let label = theLabels[i - 1];
            ctx.fillStyle = "black";
            ctx.fillText(label, buffer, (i * fontSize) + buffer + 1);
            ctx.fillStyle = theColor;
            ctx.fillText(label, buffer, (i * fontSize) + buffer);
        }
    }

}