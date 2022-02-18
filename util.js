/** Global Parameters Object */
const DEFAULT_FONT_SIZE = 10;   //in pixels
const DEFAULT_GAME_TIMER = 100; //in seconds
const PARAMS = {
    DEBUG: false,
    BLOCKWIDTH: 64,
    //GUI
    BIG_FONT: (DEFAULT_FONT_SIZE * 5) + 'px "Press Start 2P"',       //font used for big moments like damage numbers
    DEFAULT_FONT: DEFAULT_FONT_SIZE + 'px "Press Start 2P"',    //regular font
};

const SFX = {
    PING: "./sound/hitsound.wav",
    BONUS: "./sound/hitsound.wav",
    POYO: "./sound/poyo.mp3",
    SHOOT: "./sound/shoot.wav",
    JUMP: "./sound/jump.wav",
    RECORD:  "./sound/new_record.mp3",
    WOW: "./sound/incredible.mp3",
    CLICK: "./sound/click.wav",
    GO: "./sound/go.mp3",
    GAME: "./sound/game.mp3"
}

function getFacing(velocity) {
    if (velocity.x === 0 && velocity.y === 0) return 4;
    let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;

    if (-0.625 < angle && angle < -0.375) return 0;
    if (-0.375 < angle && angle < -0.125) return 1;
    if (-0.125 < angle && angle < 0.125) return 2;
    if (0.125 < angle && angle < 0.375) return 3;
    if (0.375 < angle && angle < 0.625) return 4;
    if (0.625 < angle && angle < 0.875) return 5;
    if (-0.875 > angle || angle > 0.875) return 6;
    if (-0.875 < angle && angle < -0.625) return 7;
};

function distance(A, B) {
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
};

function collide(A, B) {
    return (distance(A, B) < A.radius + B.radius);
};

/** Easy access to math functions */
const {
    pow, ceil, floor, round, log, log2: lg, max, min, random, sqrt, abs,
    PI, E, sin, cos, tan, asin, acos, atan, atan2,
} = Math

/** Easy access to logging :) (Python syntax XD) */
const { log: print } = console

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => floor(random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}, ${l})`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Random Integer between two numbers inclusively
 * @param {Number} min Lower bound
 * @param {Number} max Upper bound
 */
const getRandomInteger = (min, max) => round(Math.random() * (max - min) + min);

/**
 * Random number between two numbers inclusively
 * @param {Number} min Lower bound
 * @param {Number} max Upper bound
 */
const getRandomRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Compute log with arbitrary base
 * @param {Number} base Base of the log
 * @param {Number} x Number to take log of
 */
const logBase = (base, x) => log(x) / log(base);

/**
 * Deep copy JSON-serializable objects. ONLY FOR OBJECTS. DON'T PUT CLASSES HERE
 * @param {Object} object Object to deep copy
 * @returns Deep copy of the object
 */
const deepObjectCopy = object => JSON.parse(JSON.stringify(object));

/**
 * Returns distance from two points
 * @param {Number} x1, y1, x2, y2 Coordinates of first and second point
 * @returns Distance between the two points
 */
const getDistance = (x1, y1, x2, y2) => {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
};

/**
 * Returns random element from array
 * @param {Array} items
 * @returns Returns random element from array. Null if empty
 */
const chooseRandom = items => items.length > 0
    ? items[floor(random() * items.length)]
    : null;

/**
* if drawing text on the right this will give the proper offset
* so all the text is shown and not cut off by the canvas
*/
function getRightOffset(theText, fontSize) {
    return (theText.length) * (fontSize) + 10;
}

function drawWithBorder(ctx, theText, theX, theY, theColor) {
    ctx.fillStyle = "Black";
    ctx.fillText(theText, theX + 5, theY + 5);
    ctx.fillStyle = theColor;
    ctx.fillText(theText, theX + 1, theY + 1);
}