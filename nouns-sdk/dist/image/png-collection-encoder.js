"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNGCollectionEncoder = void 0;
const fs_1 = require("fs");
const image_1 = require("./image");
/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
class PNGCollectionEncoder {
    constructor(colors) {
        this._transparent = ['', 0];
        this._colors = new Map([this._transparent]);
        this._images = new Map();
        this._folders = {};
        // Optionally pre-populate colors with an existing palette
        colors === null || colors === void 0 ? void 0 : colors.forEach((color, index) => this._colors.set(color, index));
    }
    /**
     * The flattened run-length encoded image data
     */
    get images() {
        return this.format(true).root;
    }
    /**
     * The run-length encoded image data and file names in their respective folders
     */
    get data() {
        return { palette: [...this._colors.keys()], images: this.format() };
    }
    /**
     * Decode a PNG image and re-encode using a custom run-length encoding
     * @param image The image name
     * @param png The png image data
     * @param folder An optional containing folder name
     */
    encodeImage(name, png, folder) {
        var _a;
        const image = new image_1.Image(png.width, png.height, png.rgbaAt);
        const rle = image.toRLE(this._colors);
        this._images.set(name, rle);
        if (folder) {
            ((_a = this._folders)[folder] || (_a[folder] = [])).push(name);
        }
        return rle;
    }
    /**
     * Write the color palette and encoded part information to a JSON file
     * @param outputFile The output file path and name
     */
    writeToFile(outputFile = 'encoded-images.json') {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(outputFile, JSON.stringify(this.data, null, 2));
        });
    }
    /**
     * Return an object that contains all encoded images in their respective folders.
     * @param flatten Whether all image data should be flattened (no sub-folders)
     */
    format(flatten = false) {
        const images = new Map(this._images);
        const folders = Object.entries(this._folders);
        let data = {};
        if (!flatten && folders.length) {
            data = folders.reduce((result, [folder, filenames]) => {
                result[folder] = [];
                // Write all files to the folder, delete from the Map once written.
                filenames.forEach(filename => {
                    result[folder].push({
                        filename,
                        data: images.get(filename),
                    });
                    images.delete(filename);
                });
                return result;
            }, {});
        }
        // Write all remaining files to `root`
        if (images.size) {
            data.root = [...images.entries()].map(([filename, data]) => ({
                filename,
                data,
            }));
        }
        return data;
    }
}
exports.PNGCollectionEncoder = PNGCollectionEncoder;
