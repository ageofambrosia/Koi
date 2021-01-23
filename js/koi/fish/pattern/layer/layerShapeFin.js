/**
 * A fish fin shape which will be superimposed over a pattern
 * @param {Number} angle The fin angle in the range [0, 255]
 * @param {Number} inset The fin inset in the range [0, 255]
 * @param {Number} dips The fin dip count in the range [0, 255]
 * @param {Number} dipPower The fin dipPower in the range [0, 255]
 * @constructor
 */
const LayerShapeFin = function(angle, inset, dips, dipPower) {
    this.angle = angle;
    this.inset = inset;
    this.dips = dips;
    this.dipPower = dipPower;

    Layer.call(this);
};

LayerShapeFin.prototype = Object.create(Layer.prototype);
LayerShapeFin.prototype.SAMPLER_ANGLE = new SamplerPower(Math.PI * .35, Math.PI * .45, .5);
LayerShapeFin.prototype.SAMPLER_INSET = new SamplerPower(.03, .17, 1.8);
LayerShapeFin.prototype.SAMPLER_DIPS = new SamplerPower(0, 4, 3.8);
LayerShapeFin.prototype.SAMPLER_DIP_POWER = new SamplerPower(.5, 2, .7);

LayerShapeFin.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

uniform mediump float angle;

varying vec2 iUv;
varying float iBeta;
varying float iCutaway;
varying float iFinRadius;

void main() {
  iUv = uv;
  
  iBeta = (1.570796 - angle) * 0.5;
  iCutaway = sin(iBeta);
  iFinRadius = 1.0 / cos(iBeta);
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerShapeFin.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump float angle;
uniform mediump float inset;
uniform mediump float dips;
uniform mediump float dipPower;

varying mediump vec2 iUv;
varying mediump float iBeta;
varying mediump float iCutaway;
varying mediump float iFinRadius;

#define ALPHA 0.8

void main() {
  mediump float radiusProgress = (atan(iUv.y, iUv.x) - iBeta) / angle;
  mediump float radiusMultiplier = 1.0 - inset + inset * pow(cos(radiusProgress * 6.283185 * dips) * 0.5 + 0.5, dipPower);
  mediump float radius = length(iUv);
  
  if (radius > iFinRadius * radiusMultiplier ||
    iUv.x < sqrt(iUv.y) * iCutaway ||
    iUv.y < iUv.x * iUv.x * iCutaway)
    gl_FragColor = vec4(0.0);
  else
    gl_FragColor = vec4(ALPHA * mix(1.0, radiusMultiplier, radius));
}
`;

/**
 * Deserialize this pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
LayerShapeFin.deserialize = function(buffer) {
    return new LayerShapeFin(
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
LayerShapeFin.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.angle);
    buffer.writeUint8(this.inset);
    buffer.writeUint8(this.dips);
    buffer.writeUint8(this.dipPower);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
LayerShapeFin.prototype.configure = function(gl, program) {
    gl.uniform1f(program["uAngle"], this.SAMPLER_ANGLE.sample(this.angle / 0xFF));
    gl.uniform1f(program["uInset"], this.SAMPLER_INSET.sample(this.inset / 0xFF));
    gl.uniform1f(program["uDips"], Math.round(this.SAMPLER_DIPS.sample(this.dips / 0xFF)));
    gl.uniform1f(program["uDipPower"], this.SAMPLER_DIP_POWER.sample(this.dipPower / 0xFF));
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerShapeFin.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        ["angle", "inset", "dips", "dipPower"]);
};