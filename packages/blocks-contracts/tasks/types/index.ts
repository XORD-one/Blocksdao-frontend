import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
}

// prettier-ignore
export type DescriptorV1ContractNames = 'NFTDescriptor' | 'BlocksDescriptor';
// prettier-ignore
export type DescriptorV2ContractNames = 'NFTDescriptorV2' | 'BlocksDescriptorV2' | 'SVGRenderer' | 'BlocksArt' | 'Inflator';
// prettier-ignore
export type ContractName = DescriptorV2ContractNames | 'BlocksSeeder' | 'BlocksToken' | 'BlocksAuctionHouse' | 'BlocksAuctionHouseProxyAdmin' | 'BlocksAuctionHouseProxy' | 'BlocksDAOExecutor' | 'BlocksDAOLogicV1' | 'BlocksDAOProxy';
// prettier-ignore
export type ContractNameDescriptorV1 = DescriptorV1ContractNames | 'BlocksSeeder' | 'BlocksToken' | 'BlocksAuctionHouse' | 'BlocksAuctionHouseProxyAdmin' | 'BlocksAuctionHouseProxy' | 'BlocksDAOExecutor' | 'BlocksDAOLogicV1' | 'BlocksDAOProxy';
// prettier-ignore
export type ContractNamesDAOV2 = Exclude<ContractName, 'BlocksDAOLogicV1' | 'BlocksDAOProxy'> | 'BlocksDAOLogicV2' | 'BlocksDAOProxyV2';

export interface ContractDeployment {
  args?: (string | number | (() => string))[];
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
  validateDeployment?: () => void;
}

export interface DeployedContract {
  name: string;
  address: string;
  instance: Contract;
  constructorArguments: (string | number)[];
  libraries: Record<string, string>;
}

export interface ContractRow {
  Address: string;
  'Deployment Hash'?: string;
}
