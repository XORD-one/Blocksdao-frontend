// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;

/// @title BlockDaoSeeder contract generation of BlockDao NFTs seeds randomly

import { IBlocksDaoSeeder } from "./interfaces/IBlocksDaoSeeder.sol";
import { IBlocksDaoDescriptorMinimal } from "./interfaces/IBlocksDaoDescriptorMinimal.sol";

contract BlocksDaoSeeder is IBlocksDaoSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 blockTokenId, IBlocksDaoDescriptorMinimal descriptor) 
    external 
    view 
    override 
    returns 
    (Seed memory) 
    {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), blockTokenId))
        );

        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 capStyleCount = descriptor.capStyleCount();

        return Seed({
            background: uint48(
                uint48(pseudorandomness) % backgroundCount
            ),
            body: uint48(
                uint48(pseudorandomness >> 48) % bodyCount
            ),
            accessory: uint48(
                uint48(pseudorandomness >> 96) % accessoryCount
            ),
            capStyle: uint48(
                uint48(pseudorandomness >> 144) % capStyleCount
            )
        });
    }
}