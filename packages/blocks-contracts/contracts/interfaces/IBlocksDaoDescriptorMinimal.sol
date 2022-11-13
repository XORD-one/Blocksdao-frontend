// SPDX-License-Identifier: GPL-3.0

/// @title common interface for BlockDescriptor versions
/// used by BlockDaoToken Contract and BlockDaoSeeder Contract

pragma solidity ^0.8.12;

import { IBlocksDaoSeeder } from "./IBlocksDaoSeeder.sol";

/**
    @dev Interface for the BlockDaoDescriptor contract.
    @dev Contains function tokenURI() generates a BlockDao NFT URI.
    @dev Contains function dataURI() generates a BlockDao NFT data URI.
    @dev contains count functions for each attribute of a BlockDao NFT.
 */

interface IBlocksDaoDescriptorMinimal {
    // used by BlockDaoToken Contract

    function tokenURI(uint256 tokenId, IBlocksDaoSeeder.Seed memory seed) external view returns (string memory);

    function dataURI(uint256 tokenId, IBlocksDaoSeeder.Seed memory seed) external view returns (string memory);

    // used by BlockDaoSeeder Contract to make use of total count of each attribute and generate random attributes

    function backgroundCount() external view returns (uint256);

    function bodyCount() external view returns (uint256);

    function accessoryCount() external view returns (uint256);

    function capStyleCount() external view returns (uint256);
}