import { EncodedImage, IEncoder, ImageData, PngImage } from './types';
/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export declare class PNGCollectionEncoder implements IEncoder {
    private readonly _transparent;
    private _colors;
    private _images;
    private _folders;
    constructor(colors?: string[]);
    /**
     * The flattened run-length encoded image data
     */
    get images(): EncodedImage[];
    /**
     * The run-length encoded image data and file names in their respective folders
     */
    get data(): ImageData;
    /**
     * Decode a PNG image and re-encode using a custom run-length encoding
     * @param image The image name
     * @param png The png image data
     * @param folder An optional containing folder name
     */
    encodeImage(name: string, png: PngImage, folder?: string): string;
    /**
     * Write the color palette and encoded part information to a JSON file
     * @param outputFile The output file path and name
     */
    writeToFile(outputFile?: string): Promise<void>;
    /**
     * Return an object that contains all encoded images in their respective folders.
     * @param flatten Whether all image data should be flattened (no sub-folders)
     */
    private format;
}
