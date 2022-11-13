// SPDX-License-Identifier: GPL-3.0

/// @title Interface for BlockDaoSeeder contract
/// @author BlockDao

pragma solidity ^0.8.12;

import { IBlocksDaoDescriptorMinimal } from "./IBlocksDaoDescriptorMinimal.sol";

/**
    @dev Interface of the BlockDaoSeeder contract.
    @dev Contains struct Seed determines the attributes of a BlockDao NFT.
    @dev Contains function generateSeed() generates a BlockDao NFT seed using chainlink vrf random number.
 */

interface IBlocksDaoSeeder {
    struct Seed {
        uint48 background;
        uint48 body;
        uint48 accessory;
        uint48 capStyle;
    }

    function generateSeed(uint256 blockTokenId, IBlocksDaoDescriptorMinimal descriptor)
        external
        view
        returns (Seed memory);
}