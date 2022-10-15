"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHex = exports.toPaddedHex = void 0;
/**
 * Convert the provided number to a passed hex string
 * @param c
 * @param pad The desired number of chars in the hex string
 */
const toPaddedHex = (c, pad = 2) => {
    return c.toString(16).padStart(pad, '0');
};
exports.toPaddedHex = toPaddedHex;
/**
 * Convert an RGB color to hex (without `#` prefix)
 * @param r The red value
 * @param g The green value
 * @param b The blue value
 */
const rgbToHex = (r, g, b) => {
    return `${(0, exports.toPaddedHex)(r)}${(0, exports.toPaddedHex)(g)}${(0, exports.toPaddedHex)(b)}`;
};
exports.rgbToHex = rgbToHex;
