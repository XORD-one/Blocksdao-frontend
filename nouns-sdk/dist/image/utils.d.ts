/**
 * Convert the provided number to a passed hex string
 * @param c
 * @param pad The desired number of chars in the hex string
 */
export declare const toPaddedHex: (c: number, pad?: number) => string;
/**
 * Convert an RGB color to hex (without `#` prefix)
 * @param r The red value
 * @param g The green value
 * @param b The blue value
 */
export declare const rgbToHex: (r: number, g: number, b: number) => string;
