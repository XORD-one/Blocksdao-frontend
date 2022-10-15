import { ImageBounds, RGBAColor } from './types';
/**
 * A class used to convert an image into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 *
 * As opposed to the first encoding version, this supports multiline run-length encoding
 */
export declare class Image {
    private _width;
    private _height;
    private _bounds;
    tuples: number[][];
    private _getRgbaAt;
    constructor(width: number, height: number, getRgbaAt: (x: number, y: number) => RGBAColor);
    get height(): number;
    get width(): number;
    get bounds(): ImageBounds;
    toRLE(colors: Map<string, number>): string;
    /**
     * Given a numeric array, return a string of padded hex run-length encoded values
     * @param data The numeric array to run-length encode
     */
    private encode;
    calcBounds(): ImageBounds;
    private _isTransparentColumn;
    private _isTransparentRow;
}
