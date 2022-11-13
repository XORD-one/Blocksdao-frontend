import {
  BlocksTokenFactory,
  BlocksAuctionHouseFactory,
  BlocksDescriptorFactory,
  BlocksSeederFactory,
} from "@blockdao/contracts";

export interface ContractAddresses {
  blocksToken: string;
  blocksSeeder: string;
  blocksDescriptor: string;
  blocksAuctionHouse: string;
}

export interface Contracts {
  blocksTokenContract: ReturnType<typeof BlocksTokenFactory.connect>;
  blocksAuctionHouseContract: ReturnType<
    typeof BlocksAuctionHouseFactory.connect
  >;
  blocksDescriptorContract: ReturnType<typeof BlocksDescriptorFactory.connect>;
  blocksSeederContract: ReturnType<typeof BlocksSeederFactory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
