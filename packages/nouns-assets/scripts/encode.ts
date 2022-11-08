import { PNGCollectionEncoder, PngImage } from "@nouns/sdk";
import { promises as fs } from "fs";
import path from "path";
import { readPngImage } from "./utils";

const DESTINATION = path.join(__dirname, "../src/image2-data.json");

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const partfolders = ["1-bodies", "2-caps", "3-accessories"];
  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, "../images/v2", folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      const image = await readPngImage(path.join(folderpath, file));
      encoder.encodeImage(
        file.replace(/\.png$/, ""),
        image,
        folder.replace(/^\d-/, "")
      );
    }
  }
  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        bgcolors: ["d5d7e1", "e1d7d5"],
        ...encoder.data,
      },
      null,
      2
    )
  );
};

encode();
