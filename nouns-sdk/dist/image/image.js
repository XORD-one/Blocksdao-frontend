"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const utils_1 = require("./utils");
/**
 * A class used to convert an image into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 *
 * As opposed to the first encoding version, this supports multiline run-length encoding
 */
class Image {
    constructor(width, height, getRgbaAt) {
        this._bounds = { top: 0, bottom: 0, left: 0, right: 0 };
        this.tuples = [];
        this._width = width;
        this._height = height;
        this._getRgbaAt = getRgbaAt;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get bounds() {
        return this._bounds;
    }
    toRLE(colors) {
        this._bounds = this.calcBounds();
        const indexes = [];
        for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
            for (let x = this.bounds.left; x < this.bounds.right; x++) {
                const { r, g, b, a } = this._getRgbaAt(x, y);
                const hexColor = (0, utils_1.rgbToHex)(r, g, b);
                // Insert the color if it does not yet exist
                if (!colors.has(hexColor)) {
                    colors.set(hexColor, colors.size);
                }
                // If alpha is 0, use 'transparent' index, otherwise get color index
                indexes.push(a === 0 ? 0 : colors.get(hexColor));
            }
        }
        // [palette_index, top, right, bottom, left]
        const metadata = [
            0,
            this.bounds.top,
            this.bounds.right,
            this.bounds.bottom,
            this.bounds.left,
        ].map(v => (0, utils_1.toPaddedHex)(v));
        return `0x${metadata.join('')}${this.encode(indexes)}`;
    }
    /**
     * Given a numeric array, return a string of padded hex run-length encoded values
     * @param data The numeric array to run-length encode
     */
    encode(data) {
        const encoding = [];
        let previous = data[0];
        let count = 1;
        for (let i = 1; i < data.length; i++) {
            if (data[i] !== previous || count === 255) {
                encoding.push((0, utils_1.toPaddedHex)(count), (0, utils_1.toPaddedHex)(previous));
                this.tuples.push([count, previous]);
                count = 1;
                previous = data[i];
            }
            else {
                count++;
            }
        }
        if (previous !== undefined) {
            encoding.push((0, utils_1.toPaddedHex)(count), (0, utils_1.toPaddedHex)(previous));
        }
        return encoding.join('');
    }
    calcBounds() {
        let bottom = this.height - 1;
        while (bottom > 0 && this._isTransparentRow(bottom)) {
            bottom--;
        }
        let top = 0;
        while (top < bottom && this._isTransparentRow(top)) {
            top++;
        }
        let right = this.width - 1;
        while (right >= 0 && this._isTransparentColumn(right)) {
            right--;
        }
        let left = 0;
        while (left < right && this._isTransparentColumn(left)) {
            left++;
        }
        return {
            top: top,
            bottom: bottom,
            left: left,
            right: right + 1, // right bound is calculated to be one pixel outside the content
        };
    }
    _isTransparentColumn(column) {
        for (let row = 0; row < this.height; row++) {
            if (this._getRgbaAt(column, row).a !== 0) {
                return false;
            }
        }
        return true;
    }
    _isTransparentRow(row) {
        for (let column = 0; column < this.width; column++) {
            if (this._getRgbaAt(column, row).a !== 0) {
                return false;
            }
        }
        return true;
    }
}
exports.Image = Image;
