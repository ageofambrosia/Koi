/**
 * Bugs
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const Bugs = function(gl, constellation, bugSpots) {
    this.gl = gl;
    this.constellation = constellation;
    this.bugSpots = bugSpots;
    this.bugs = [];

    for (const spot of this.bugSpots)
        spot.normalize(constellation.width, constellation.height);
};

Bugs.prototype.PATH_EDGE_PADDING = 1;

/**
 * Make a bug path
 * @param {Random} random A randomizer
 * @returns {BugPath} A bug path
 */
Bugs.prototype.makePath = function(random) {
    return new BugPath();
};

/**
 * Make a bug
 * @param {Random} random A randomizer
 * @returns {Bug} A bug
 */
Bugs.prototype.makeBug = function(random) {
    return new Bug(
        new BugBodyButterfly(this.gl),
        this.makePath(random));
};

/**
 * Update the bugs
 * @param {Random} random A randomizer
 */
Bugs.prototype.update = function(random) {
    if (this.bugs.length < 2)
        this.bugs.push(this.makeBug(random));

    for (let bug = this.bugs.length; bug-- > 0;) if (bug.update()) {
        bug.free();

        this.bugs.splice(bug, 1);
    }
};

/**
 * Render the bugs
 * @param {Flying} flying The flying objects renderer
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
Bugs.prototype.render = function(flying, air, time) {
    for (const bug of this.bugs)
        bug.render(this.constellation.width, this.constellation.height, flying, air, time);
};

/**
 * Free the bugs
 */
Bugs.prototype.free = function() {
    for (const bug of this.bugs)
        bug.free();
};