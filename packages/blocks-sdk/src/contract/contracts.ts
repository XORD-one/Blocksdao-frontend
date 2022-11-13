import {
  BlocksTokenFactory,
  BlocksAuctionHouseFactory,
  BlocksDescriptorFactory,
  BlocksSeederFactory,
} from "@blockdao/contracts";
import type { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { getContractAddressesForChainOrThrow } from "./addresses";
import { Contracts } from "./types";

/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
export const getContractsForChainOrThrow = (
  chainId: number,
  signerOrProvider?: Signer | Provider
): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId);

  return {
    blocksTokenContract: BlocksTokenFactory.connect(
      addresses.blocksToken,
      signerOrProvider as Signer | Provider
    ),
    blocksAuctionHouseContract: BlocksAuctionHouseFactory.connect(
      addresses.blocksAuctionHouse,
      signerOrProvider as Signer | Provider
    ),
    blocksDescriptorContract: BlocksDescriptorFactory.connect(
      addresses.blocksDescriptor,
      signerOrProvider as Signer | Provider
    ),
    blocksSeederContract: BlocksSeederFactory.connect(
      addresses.blocksSeeder,
      signerOrProvider as Signer | Provider
    ),
  };
};
