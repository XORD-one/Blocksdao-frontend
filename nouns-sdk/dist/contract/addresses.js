"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractAddressesForChainOrThrow = void 0;
const addresses_json_1 = __importDefault(require("./addresses.json"));
/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
const getContractAddressesForChainOrThrow = (chainId) => {
    const _addresses = addresses_json_1.default;
    if (!_addresses[chainId]) {
        throw new Error(`Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`);
    }
    return _addresses[chainId];
};
exports.getContractAddressesForChainOrThrow = getContractAddressesForChainOrThrow;
