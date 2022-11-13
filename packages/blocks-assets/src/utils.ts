import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BlockData, BlockSeed } from "./types";
import { images, bgcolors } from "./image-data.json";

const { bodies, accessories, caps } = images;

/**
 * Get encoded part and background information using a Block seed
 * @param seed The Block seed
 */
export const getBlockData = (seed: any): BlockData => {
  return {
    parts: [
      bodies[seed.body],
      accessories[seed.accessory],
      caps[seed.capStyle],
    ],
    background: bgcolors[seed.background],
  };
};

/**
 * Generate a random Block seed
 * @param seed The Block seed
 */
export const getRandomBlockSeed = (): BlockSeed => {
  return {
    background: Math.floor(Math.random() * bgcolors.length),
    body: Math.floor(Math.random() * bodies.length),
    accessory: Math.floor(Math.random() * accessories.length),
    caps: Math.floor(Math.random() * caps.length),
  };
};

/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param shiftAmount The amount to right shift
 * @param uintSize The uint bit size to cast to
 */
export const shiftRightAndCast = (
  value: BigNumberish,
  shiftAmount: number,
  uintSize: number
): string => {
  const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
  return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};

/**
 * Emulates the BlocksSeeder.sol methodology for pseudorandomly selecting a part
 * @param pseudorandomness Hex representation of a number
 * @param partCount The number of parts to pseudorandomly choose from
 * @param shiftAmount The amount to right shift
 * @param uintSize The size of the unsigned integer
 */
export const getPseudorandomPart = (
  pseudorandomness: string,
  partCount: number,
  shiftAmount: number,
  uintSize: number = 48
): number => {
  const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
  return BigNumber.from(hex).mod(partCount).toNumber();
};

/**
 * Emulates the BlocksSeeder.sol methodology for generating a Block seed
 * @param blockId The Block tokenId used to create pseudorandomness
 * @param blockHash The block hash use to create pseudorandomness
 */
export const getBlockSeedFromBlockHash = (
  blockId: BigNumberish,
  blockHash: string
): BlockSeed => {
  const pseudorandomness = solidityKeccak256(
    ["bytes32", "uint256"],
    [blockHash, blockId]
  );
  return {
    background: getPseudorandomPart(pseudorandomness, bgcolors.length, 0),
    body: getPseudorandomPart(pseudorandomness, bodies.length, 48),
    accessory: getPseudorandomPart(pseudorandomness, accessories.length, 96),
    caps: getPseudorandomPart(pseudorandomness, caps.length, 192),
  };
};
