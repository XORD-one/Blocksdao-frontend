// SPDX-License-Identifier: GPL-3.0

/// @title BlockDaoToken ERC-721 token

pragma solidity ^0.8.12;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Checkpointable} from "./base/ERC721Checkpointable.sol";
import {IBlocksDaoDescriptorMinimal} from "./interfaces/IBlocksDaoDescriptorMinimal.sol";
import {IBlocksDaoSeeder} from "./interfaces/IBlocksDaoSeeder.sol";
import {IBlocksToken} from "./interfaces/IBlocksToken.sol";
import {ERC721} from "./base/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IProxyRegistry} from "./external/opensea/IProxyRegistry.sol";

contract BlocksToken is IBlocksToken, Ownable, ERC721Checkpointable {
    // The block DAO address (creators org)
    address public blockDao;

    // An address who has permissions to mint Nouns // BlockDao Auction House
    address public minter;

    // The BlockDao token URI descriptor
    IBlocksDaoDescriptorMinimal public descriptor;

    // The BlockDao token seeder
    IBlocksDaoSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The Block seeds
    /*
        @dev A mapping of BlockDao NFT token id to its seed.
        @dev A seed is a struct of 4 uint48 numbers.
        @dev Each number represents a BlockDao NFT attribute.
        @dev The seed is generated using chainlink vrf random number.
     */
    mapping(uint256 => IBlocksDaoSeeder.Seed) public seeds;

    // The internal Block ID tracker
    uint256 private _currentBlockId;

    // IPFS content hash of contract-level metadata
    /*
        @dev A string of IPFS content hash of contract-level metadata.
        @dev The metadata is a JSON file.
        @dev The metadata contains the contract name, symbol, description, and other attributes.
     */
    string private _contractURIHash =
        "QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX";

    // OpenSea's Proxy Registry
    IProxyRegistry public immutable proxyRegistry;

    /**
     * @notice Require that the minter has not been locked.
     */
    modifier whenMinterNotLocked() {
        require(!isMinterLocked, "Minter is locked");
        _;
    }

    /**
     * @notice Require that the descriptor has not been locked.
     */
    modifier whenDescriptorNotLocked() {
        require(!isDescriptorLocked, "Descriptor is locked");
        _;
    }

    /**
     * @notice Require that the seeder has not been locked.
     */
    modifier whenSeederNotLocked() {
        require(!isSeederLocked, "Seeder is locked");
        _;
    }

    /**
     * @notice Require that the sender is the blockDAO.
     */
    modifier onlyBlockDao() {
        require(msg.sender == blockDao, "Sender is not the Block DAO");
        _;
    }

    /**
     * @notice Require that the sender is the minter.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, "Sender is not the minter");
        _;
    }

    constructor(
        //address _blocksDao,
        address _minter,
        IBlocksDaoDescriptorMinimal _descriptor,
        IBlocksDaoSeeder _seeder,
        IProxyRegistry _proxyRegistry
    ) ERC721("Blocks", "BLOCK") {
        //blockDao = _blocksDao;
        minter = _minter;
        descriptor = _descriptor;
        seeder = _seeder;
        proxyRegistry = _proxyRegistry;
    }

    /**
     * @notice The IPFS URI of contract-level metadata.
     */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked("ipfs://", _contractURIHash));
    }

    /**
     * @notice Set the _contractURIHash.
     * @dev Only callable by the owner.
     */
    function setContractURIHash(string memory newContractURIHash)
        external
        onlyOwner
    {
        _contractURIHash = newContractURIHash;
    }

    /**
     * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator)
        public
        view
        override(IERC721, ERC721)
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        if (proxyRegistry.proxies(owner) == operator) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }

    /**
     * @notice Mint a Block to the minter, along with a possible BlockFounders reward
     * Block. BlockFounders reward Blocks are minted every 10 Nouns, starting at 0,
     * until 183 BlockFounders Blocks have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     * @return The Block ID.
     */
    function mint() public override onlyMinter returns (uint256) {
        //if (_currentBlockId <= 1820 && _currentBlockId % 10 == 0) {
        //     _mintTo(blockDao, _currentBlockId++);
        // }
        return _mintTo(minter, _currentBlockId++);
    }

    /**
     * @notice Burn a noun.
     */
    function burn(uint256 blockId) public override onlyMinter {
        _burn(blockId);
        emit BlockBurned(blockId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "blocksToken: URI query for nonexistent token"
        );
        return descriptor.tokenURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "NounsToken: URI query for nonexistent token"
        );
        return descriptor.dataURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Set the  blockDAO.
     * @dev Only callable by the  blockDAO when not locked.
     */
    function setBlockDao(address _blocksDao) external override onlyBlockDao {
        blockDao = _blocksDao;

        emit BlockDAOUpdated(_blocksDao);
    }

    /**
     * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
    function setMinter(address _minter)
        external
        override
        onlyOwner
        whenMinterNotLocked
    {
        minter = _minter;

        emit MinterUpdated(_minter);
    }

    /**
     * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockMinter() external override onlyOwner whenMinterNotLocked {
        isMinterLocked = true;

        emit MinterLocked();
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by the owner when not locked.
     */
    function setDescriptor(IBlocksDaoDescriptorMinimal _descriptor)
        external
        override
        onlyOwner
        whenDescriptorNotLocked
    {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }

    /**
     * @notice Lock the descriptor.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockDescriptor()
        external
        override
        onlyOwner
        whenDescriptorNotLocked
    {
        isDescriptorLocked = true;

        emit DescriptorLocked();
    }

    /**
     * @notice Set the token seeder.
     * @dev Only callable by the owner when not locked.
     */
    function setSeeder(IBlocksDaoSeeder _seeder)
        external
        override
        onlyOwner
        whenSeederNotLocked
    {
        seeder = _seeder;

        emit SeederUpdated(_seeder);
    }

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockSeeder() external override onlyOwner whenSeederNotLocked {
        isSeederLocked = true;

        emit SeederLocked();
    }

    /**
     * @notice Mint a Block with `blockId` to the provided `to` address.
     * @dev This is a private function that is called by `mint` and `mintTo`.
     * @return The Block ID.
     * @dev seeder.seed() is called to get the seed for the Block.
     */
    function _mintTo(address to, uint256 blockId) internal returns (uint256) {
        IBlocksDaoSeeder.Seed memory seed = seeds[blockId] = seeder
            .generateSeed(blockId, descriptor);

        _mint(owner(), to, blockId);
        emit BlockCreated(blockId, seed);

        return blockId;
    }
}
