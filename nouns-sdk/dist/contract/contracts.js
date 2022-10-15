"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractsForChainOrThrow = void 0;
const contracts_1 = require("@nouns/contracts");
const addresses_1 = require("./addresses");
/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
const getContractsForChainOrThrow = (chainId, signerOrProvider) => {
    const addresses = (0, addresses_1.getContractAddressesForChainOrThrow)(chainId);
    return {
        nounsTokenContract: contracts_1.NounsTokenFactory.connect(addresses.nounsToken, signerOrProvider),
        nounsAuctionHouseContract: contracts_1.NounsAuctionHouseFactory.connect(addresses.nounsAuctionHouseProxy, signerOrProvider),
        nounsDescriptorContract: contracts_1.NounsDescriptorFactory.connect(addresses.nounsDescriptor, signerOrProvider),
        nounsSeederContract: contracts_1.NounsSeederFactory.connect(addresses.nounsSeeder, signerOrProvider),
        nounsDaoContract: contracts_1.NounsDaoLogicV1Factory.connect(addresses.nounsDAOProxy, signerOrProvider),
    };
};
exports.getContractsForChainOrThrow = getContractsForChainOrThrow;
