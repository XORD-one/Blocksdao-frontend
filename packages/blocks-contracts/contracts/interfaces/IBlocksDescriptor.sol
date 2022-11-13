// SPDX-License-Identifier: GPL-3.0

/// @title Interface for BlocksDescriptor contract.

pragma solidity ^0.8.12;

import { IBlocksDaoSeeder } from "./IBlocksDaoSeeder.sol";
import { ISVGRenderer } from "./ISVGRenderer.sol";
import { IBlocksArt } from "./IBlocksArt.sol";
import { IBlocksDaoDescriptorMinimal } from "./IBlocksDaoDescriptorMinimal.sol";

interface IBlocksDescriptor is IBlocksDaoDescriptorMinimal {
    event PartsLocked();

    event DataURIToggled(bool enabled);

    event BaseURIUpdated(string baseURI);

    event ArtUpdated(IBlocksArt art);

    event RendererUpdated(ISVGRenderer renderer);

    error EmptyPalette();
    error BadPaletteLength();
    error IndexNotFound();

    function arePartsLocked() external returns (bool);

    function isDataURIEnabled() external returns (bool);

    function baseURI() external returns (string memory);

    function palettes(uint8 paletteIndex) external view returns (bytes memory);

    function backgrounds(uint256 index) external view returns (string memory);

    function bodies(uint256 index) external view returns (bytes memory);

    function accessories(uint256 index) external view returns (bytes memory);

    function capStyles(uint256 index) external view returns (bytes memory);

    function backgroundCount() external view override returns (uint256);

    function bodyCount() external view override returns (uint256);

    function accessoryCount() external view override returns (uint256);

    function capStyleCount() external view override returns (uint256);

    function addManyBackgrounds(string[] calldata backgrounds) external;

    function addBackground(string calldata background) external;

    function setPalette(uint8 paletteIndex, bytes calldata palette) external;

    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addCapStyles(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function setPalettePointer(uint8 paletteIndex, address pointer) external;

    function addBodiesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addAccessoriesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addCapStylesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function lockParts() external;

    function toggleDataURIEnabled() external;

    function setBaseURI(string calldata baseURI) external;

    function tokenURI(uint256 tokenId, IBlocksDaoSeeder.Seed memory seed)
        external
        view
        override
        returns (string memory);

    function dataURI(uint256 tokenId, IBlocksDaoSeeder.Seed memory seed) external view override returns (string memory);

    function genericDataURI(
        string calldata name,
        string calldata description,
        IBlocksDaoSeeder.Seed memory seed
    ) external view returns (string memory);

    function generateSVGImage(IBlocksDaoSeeder.Seed memory seed) external view returns (string memory);
}