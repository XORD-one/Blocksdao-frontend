export interface BlockSeed {
  background: number;
  body: number;
  accessory: number;
  caps: number;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface BlockData {
  parts: EncodedImage[];
  background: string;
}
