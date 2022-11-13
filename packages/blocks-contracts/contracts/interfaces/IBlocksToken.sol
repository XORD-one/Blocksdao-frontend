// SPDX-License-Identifier: GPL-3.0

/// @title Interface for BlocksToken

pragma solidity ^0.8.12;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IBlocksDaoDescriptorMinimal } from "./IBlocksDaoDescriptorMinimal.sol";
import { IBlocksDaoSeeder } from "./IBlocksDaoSeeder.sol";

interface IBlocksToken is IERC721 {
    event BlockCreated(uint256 indexed tokenId, IBlocksDaoSeeder.Seed seed);

    event BlockBurned(uint256 indexed tokenId);

    event BlockDAOUpdated(address blockDao);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(IBlocksDaoDescriptorMinimal descriptor);

    event DescriptorLocked();

    event SeederUpdated(IBlocksDaoSeeder seeder);

    event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setBlockDao(address blockDao) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(IBlocksDaoDescriptorMinimal descriptor) external;

    function lockDescriptor() external;

    function setSeeder(IBlocksDaoSeeder seeder) external;

    function lockSeeder() external;
}