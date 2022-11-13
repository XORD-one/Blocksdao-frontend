import { task, types } from 'hardhat/config';
import { ContractName, ContractNameDescriptorV1, DeployedContract } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

task('update-configs', 'Write the deployed addresses to the SDK and subgraph configs')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(
    async (
      {
        contracts,
      }: { contracts: Record<ContractName | ContractNameDescriptorV1, DeployedContract> },
      { ethers },
    ) => {
      const { name: network, chainId } = await ethers.provider.getNetwork();

      // Update SDK addresses
      const sdkPath = join(__dirname, '../../blocks-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        blocksToken: contracts.BlocksToken.address,
        blocksSeeder: contracts.BlocksSeeder.address,
        blocksDescriptor: contracts.BlocksDescriptorV2
          ? contracts.BlocksDescriptorV2.address
          : contracts.BlocksDescriptor.address,
        nftDescriptor: contracts.NFTDescriptorV2
          ? contracts.NFTDescriptorV2.address
          : contracts.NFTDescriptor.address,
        blocksAuctionHouse: contracts.BlocksAuctionHouse.address,
        blocksAuctionHouseProxy: contracts.BlocksAuctionHouseProxy.address,
        blocksAuctionHouseProxyAdmin: contracts.BlocksAuctionHouseProxyAdmin.address,
        blocksExecutor: contracts.BlocksDAOExecutor.address,
        blocksDAOProxy: contracts.BlocksDAOProxy.address,
        blocksDAOLogicV1: contracts.BlocksDAOLogicV1.address,
      };
      writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
      try {
        execSync('yarn build', {
          cwd: sdkPath,
        });
      } catch {
        console.log('Failed to re-build `@blocks/sdk`. Please rebuild manually.');
      }
      console.log('Addresses written to the Blocks SDK.');

      // Generate subgraph config
      const configName = `${network}-fork`;
      const subgraphConfigPath = join(__dirname, `../../blocks-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        blocksToken: {
          address: contracts.BlocksToken.address,
          startBlock: contracts.BlocksToken.instance.deployTransaction.blockNumber,
        },
        blocksAuctionHouse: {
          address: contracts.BlocksAuctionHouseProxy.address,
          startBlock: contracts.BlocksAuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        blocksDAO: {
          address: contracts.BlocksDAOProxy.address,
          startBlock: contracts.BlocksDAOProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );