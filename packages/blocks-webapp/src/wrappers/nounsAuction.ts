import { useContractCall } from "@usedapp/core";
import { BigNumber as EthersBN, utils } from "ethers";
import { BlocksAuctionHouseABI } from "@blockdao/sdk";
// import config from "../config";
import BigNumber from "bignumber.js";
import { isNounderNoun } from "../utils/nounderNoun";
import { useAppSelector } from "../hooks";
import { AuctionState } from "../state/slices/auction";

export enum AuctionHouseContractFunction {
  auction = "auction",
  duration = "duration",
  minBidIncrementPercentage = "minBidIncrementPercentage",
  nouns = "nouns",
  createBid = "createBid",
  settleCurrentAndCreateNewAuction = "settleCurrentAndCreateNewAuction",
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  blockId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(BlocksAuctionHouseABI);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    abi,
    address: "0x9e885313BCA79674Eb5B5Cc393BE3ccBb087D25B",
    method: "auction",
    args: [],
  });
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: "0x9e885313BCA79674Eb5B5Cc393BE3ccBb087D25B",
    method: "minBidIncrementPercentage",
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a Noun could vote
 * @param blockId TokenId of Noun
 * @returns Unix timestamp after which Noun could vote
 */
export const useNounCanVoteTimestamp = (blockId: number) => {
  const nextblockId = blockId + 1;

  const nextblockIdForQuery = isNounderNoun(EthersBN.from(nextblockId))
    ? nextblockId + 1
    : nextblockId;

  const pastAuctions = useAppSelector(
    (state) => state.pastAuctions.pastAuctions
  );

  const maybeNounCanVoteTimestamp = pastAuctions.find(
    (auction: AuctionState, i: number) => {
      const maybeblockId = auction.activeAuction?.blockId;
      return maybeblockId
        ? EthersBN.from(maybeblockId).eq(EthersBN.from(nextblockIdForQuery))
        : false;
    }
  )?.activeAuction?.startTime;

  if (!maybeNounCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return EthersBN.from(0);
  }

  return EthersBN.from(maybeNounCanVoteTimestamp);
};
