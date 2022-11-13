import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-noun', 'Mints a Noun')
  .addOptionalParam(
    'blocksToken',
    'The `BlocksToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ blocksToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('BlocksToken');
    const nftContract = nftFactory.attach(blocksToken);

    const receipt = await (await nftContract.mint()).wait();
    const nounCreated = receipt.events?.[1];
    const { tokenId } = nounCreated?.args as Result;

    console.log(`Noun minted with ID: ${tokenId.toString()}.`);
  });
