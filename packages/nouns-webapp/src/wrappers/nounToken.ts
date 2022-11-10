import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import { BigNumber as EthersBN, ethers, utils } from "ethers";

import { NounsTokenFactory } from "../blocks/contracts";

import config, { cache, cacheKey, CHAIN_ID } from "../config";
import { useQuery } from "@apollo/client";
import { seedsQuery } from "./subgraph";
import { useEffect } from "react";

import { BlocksToken_Address, BlocksToken_ABI } from "../contracts/BlocksToken";

interface BlockToken {
  name: string;
  description: string;
  image: string;
}

export interface IBlockSeed {
  accessory: number;
  background: number;
  body: number;
  capStyle?: number;
}

export enum NounsTokenContractFunction {
  delegateVotes = "votesToDelegate",
}

const abi = new utils.Interface(BlocksToken_ABI);
const seedCacheKey = cacheKey(
  cache.seed,
  CHAIN_ID,
  config.addresses.nounsToken
);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ["body", "accessory"];
  const hasExpectedKeys = expectedKeys.every((key) =>
    (seed || {}).hasOwnProperty(key)
  );
  const hasValidValues = Object.values(seed || {}).some((v) => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useNounToken = (nounId: EthersBN) => {
  const [noun] =
    useContractCall<[string]>({
      BlocksToken_ABI,
      address: BlocksToken_Address,
      method: "dataURI",
      args: [nounId],
    }) || [];
  if (!noun) {
    return;
  }

  const nounImgData = noun.split(";base64,").pop() as string;
  const json: BlockToken = JSON.parse(atob(nounImgData));

  return json;
};

const seedArrayToObject = (seeds: (IBlockSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, IBlockSeed>>((acc, seed) => {
    acc[seed.id] = {
      background: Number(seed.background),
      body: Number(seed.body),
      accessory: Number(seed.accessory),
      // capStyle: Number(seed.capStyle),
    };
    return acc;
  }, {});
};

// const useNounSeeds = () => {
//   const cache = localStorage.getItem(seedCacheKey);
//   const cachedSeeds = cache ? JSON.parse(cache) : undefined;
//   const { data } = useQuery(seedsQuery(), {
//     skip: !!cachedSeeds,
//   });

//   useEffect(() => {
//     if (!cachedSeeds && data?.seeds?.length) {
//       localStorage.setItem(
//         seedCacheKey,
//         JSON.stringify(seedArrayToObject(data.seeds))
//       );
//     }
//   }, [data, cachedSeeds]);

//   return cachedSeeds;
// };

export const useNounSeed = (nounId: EthersBN) => {
  // const seeds = useNounSeeds();

  // console.log("seeds", seeds);
  // const seed = seeds?.[nounId.toString()];

  // console.log("seed_id", seed);
  console.log("noundId", nounId);
  const request = {
    abi,
    address: BlocksToken_Address,
    method: "seeds",
    args: [13],
  };
  const response = useContractCall<IBlockSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: response.accessory,
          background: response.background,
          body: response.body,
          capStyle: response.capStyle,
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);
    }
    return response;
  }
  return response;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  return useAccountVotes(account ?? ethers.constants.AddressZero);
};

export const useAccountVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: BlocksToken_Address,
      method: "getCurrentVotes",
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: BlocksToken_Address,
      method: "delegates",
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (
  block: number | undefined
): number | undefined => {
  const { account } = useEthers();
  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: BlocksToken_Address,
      method: "getPriorVotes",
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const nounsToken: any = new NounsTokenFactory().attach(BlocksToken_Address);

  const { send, state } = useContractFunction(nounsToken, "delegate");

  return { send, state };
};

export const useNounTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: BlocksToken_Address,
      method: "balanceOf",
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserNounTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: BlocksToken_Address,
      method: "balanceOf",
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
