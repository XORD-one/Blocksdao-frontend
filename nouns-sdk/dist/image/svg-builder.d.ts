import { DecodedImage } from './types';
/**
 * Decode the RLE image data into a format that's easier to consume in `buildSVG`.
 * @param image The RLE image data
 */
export declare const decodeImage: (image: string) => DecodedImage;
/**
 * Given RLE parts, palette colors, and a background color, build an SVG image.
 * @param parts The RLE part datas
 * @param paletteColors The hex palette colors
 * @param bgColor The hex background color
 */
export declare const buildSVG: (parts: {
    data: string;
}[], paletteColors: string[], bgColor: string) => string;
