/**
 * Predefined mutations
 */
const Mutations = function() {
    this.mutations = this.createMutations();
};

/**
 * Serialize the mutations state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Mutations.prototype.serialize = function(buffer) {
    // TODO
};

/**
 * Deserialize the mutations state
 * @param {BinBuffer} buffer A buffer to serialize from
 */
Mutations.prototype.deserialize = function(buffer) {
    // TODO
};

/**
 * Create the list of possible mutations
 * @returns {Mutation[]} An array containing all possible mutations
 */
Mutations.prototype.createMutations = function() {
    return [
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerSpots(
                    // Palette index
                    Mutation.createPaletteReference(false, -1),
                    // Scale
                    new Sampler(100, 130),
                    // Stretch
                    new Sampler(120, 136),
                    // Threshold
                    new Sampler(180, 200),
                    // X focus
                    new Sampler(120, 136),
                    // Y focus
                    new Sampler(120, 136),
                    // Power
                    new Sampler(160, 170)
                )
            ],
            .2
        ),
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerSpots(
                    // Palette index
                    Mutation.createPaletteReference(false, -2),
                    // Scale
                    new Sampler(220, 250),
                    // Stretch
                    new Sampler(120, 136),
                    // Threshold
                    new Sampler(180, 200),
                    // X focus
                    new Sampler(120, 136),
                    // Y focus
                    new Sampler(120, 136),
                    // Power
                    new Sampler(160, 170)
                )
            ],
            .2
        )
    ];
};