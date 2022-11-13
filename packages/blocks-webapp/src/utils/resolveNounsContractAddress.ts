import config from "../config";

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    // case config.addresses.nounsDAOProxy.toLowerCase():

    case "":
      return "Nouns DAO Proxy";
    // case config.addresses.nounsAuctionHouseProxy.toLowerCase():
    case "":
      return "Nouns Auction House Proxy";
    // case config.addresses.nounsDaoExecutor.toLowerCase():
    case "":
      return "Nouns DAO Treasury";
    default:
      return undefined;
  }
};
