/**
 * A koi card
 * @param {FishBody} body The fish body represented by this card
 * @param {Vector2} position The initial card position
 * @param {Number} [angle] The initial card angle
 * @constructor
 */
const Card = function(body, position, angle = 0) {
    this.body = body;
    this.position = position;
    this.positionPrevious = position.copy();
    this.angle = this.anglePrevious = angle;
    this.element = this.createElement();

    this.updatePosition();
};

Card.prototype.CLASS = "card";
Card.prototype.WIDTH = StyleUtils.getInt("--card-width");
Card.prototype.HEIGHT = StyleUtils.getInt("--card-height");
Card.prototype.RATIO = Card.prototype.WIDTH / Card.prototype.HEIGHT;

/**
 * Deserialize a card
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @param {Vector2} [position] The position to deserialize the card at
 * @param {Number} [angle] The card angle
 * @returns {Card} The deserialized card
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Card.deserialize = function(buffer, position = new Vector2(), angle = 0) {
    return new Card(FishBody.deserialize(buffer), position, angle);
};

/**
 * Serialize the card
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Card.prototype.serialize = function(buffer) {
    this.body.serialize(buffer);
};

/**
 * Render the card, updates every refresh
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.render = function(time) {
    this.updatePosition(time);
};

/**
 * Move the card
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Card.prototype.move = function(dx, dy) {
    this.positionPrevious.set(this.position);

    this.position.x += dx;
    this.position.y += dy;
};

/**
 * Rotate the card
 * @param {Number} da The rotation delta in radians
 */
Card.prototype.rotate = function(da) {
    this.anglePrevious = this.angle;
    this.angle += da;
};

/**
 * Stop interpolated motion
 */
Card.prototype.stopMoving = function() {
    this.positionPrevious.set(this.position);
};

/**
 * Update this cards element position
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.updatePosition = function(time = 0) {
    const x = this.positionPrevious.x + (this.position.x - this.positionPrevious.x) * time;
    const y = this.positionPrevious.y + (this.position.y - this.positionPrevious.y) * time;
    const angle = this.anglePrevious + (this.angle - this.anglePrevious) * time;

    this.element.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";

    if (this.angle !== 0)
        this.element.style.transform += "rotate(" + angle + "rad)";
};

/**
 * Clear the card transformation
 */
Card.prototype.clearTransform = function() {
    this.element.style.removeProperty("transform");
};

/**
 * Create an HTML element for this card
 * @returns {HTMLElement} The card element
 */
Card.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;

    return element;
};