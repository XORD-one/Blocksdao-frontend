import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, DAppProvider } from "@usedapp/core"; 
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import account from "./state/slices/account";
import application from "./state/slices/application";
import logs from "./state/slices/logs";
import auction, {
  reduxSafeAuction,
  reduxSafeNewAuction,
  reduxSafeBid,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from "./state/slices/auction";
import onDisplayAuction, {
  setLastAuctionBlockId,
  setOnDisplayAuctionBlockId,
} from "./state/slices/onDisplayAuction";
import { ApolloProvider, useQuery } from "@apollo/client";
import { clientFactory, latestAuctionsQuery } from "./wrappers/subgraph";
import { useEffect } from "react";
import pastAuctions, { addPastAuctions } from "./state/slices/pastAuctions";
import LogsUpdater from "./state/updaters/logs";
import config, {
  CHAIN_ID,
  createNetworkHttpUrl,
  multicallOnLocalhost,
} from "./config";
import { WebSocketProvider } from "@ethersproject/providers";
import { BigNumber, BigNumberish } from "ethers";
import { BlocksAuctionHouseFactory } from "@blockdao/sdk";
import dotenv from "dotenv";
import { useAppDispatch, useAppSelector } from "./hooks";
import { appendBid } from "./state/slices/auction";
import { ConnectedRouter, connectRouter } from "connected-react-router";
import { createBrowserHistory, History } from "history";
import {
  applyMiddleware,
  createStore,
  combineReducers,
  PreloadedState,
} from "redux";
import { routerMiddleware } from "connected-react-router";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { nounPath } from "./utils/history";
import { push } from "connected-react-router";
import { LanguageProvider } from "./i18n/LanguageProvider";

dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history) // for dispatching history actions
        // ... other middlewares ...
      )
    )
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const supportedChainURLs = {
  [ChainId.Mainnet]: createNetworkHttpUrl("mainnet"),
  [ChainId.Rinkeby]: createNetworkHttpUrl("rinkeby"),
  [ChainId.Hardhat]: "http://localhost:8545",
  [ChainId.Goerli]: createNetworkHttpUrl("goerli"),
};

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: supportedChainURLs[CHAIN_ID],
  },
  multicallAddresses: {
    [ChainId.Hardhat]: multicallOnLocalhost,
  }
};

const client = clientFactory(config.app.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const BLOCKS_PER_DAY = 6_500;

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();

  const loadState = async () => {
    const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
    const blocksAuctionHouseContract = BlocksAuctionHouseFactory.connect(
      "0x9e885313BCA79674Eb5B5Cc393BE3ccBb087D25B",
      wsProvider
    );
    console.log("blocksAuctionHouse", blocksAuctionHouseContract);
    const bidFilter = blocksAuctionHouseContract.filters.AuctionBid(
      null,
      null,
      null,
      null
    );
    const extendedFilter = blocksAuctionHouseContract.filters.AuctionExtended(
      null,
      null
    );
    const createdFilter = blocksAuctionHouseContract.filters.AuctionCreated(
      null,
      null,
      null
    );
    const settledFilter = blocksAuctionHouseContract.filters.AuctionSettled(
      null,
      null,
      null
    );
    const processBidFilter = async (
      blockId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any
    ) => {
      const timestamp = (await event.getBlock()).timestamp;
      const transactionHash = event.transactionHash;
      dispatch(
        appendBid(
          reduxSafeBid({
            blockId,
            sender,
            value,
            extended,
            transactionHash,
            timestamp,
          })
        )
      );
    };
    const processAuctionCreated = (
      blockId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish
    ) => {
      dispatch(
        setActiveAuction(
          reduxSafeNewAuction({ blockId, startTime, endTime, settled: false })
        )
      );
      const blockIdNumber = BigNumber.from(blockId).toNumber();
      dispatch(push(nounPath(blockIdNumber)));
      dispatch(setOnDisplayAuctionBlockId(blockIdNumber));
      dispatch(setLastAuctionBlockId(blockIdNumber));
    };
    const processAuctionExtended = (
      blockId: BigNumberish,
      endTime: BigNumberish
    ) => {
      dispatch(setAuctionExtended({ blockId, endTime }));
    };
    const processAuctionSettled = (
      blockId: BigNumberish,
      winner: string,
      amount: BigNumberish
    ) => {
      dispatch(setAuctionSettled({ blockId, amount, winner }));
    };

    // Fetch the current auction
    const currentAuction = await blocksAuctionHouseContract.auction();
    console.log("currentAuction", currentAuction);
    dispatch(setFullAuction(reduxSafeAuction(currentAuction)));
    dispatch(setLastAuctionBlockId(currentAuction.blockId.toNumber()));

    // Fetch the previous 24hours of  bids
    const previousBids = await blocksAuctionHouseContract.queryFilter(
      bidFilter,
      0 - BLOCKS_PER_DAY
    );
    for (let event of previousBids) {
      if (event.args === undefined) return;
      processBidFilter(
        ...(event.args as [BigNumber, string, BigNumber, boolean]),
        event
      );
    }

    blocksAuctionHouseContract.on(
      bidFilter,
      (blockId, sender, value, extended, event) =>
        processBidFilter(blockId, sender, value, extended, event)
    );
    blocksAuctionHouseContract.on(
      createdFilter,
      (blockId, startTime, endTime) =>
        processAuctionCreated(blockId, startTime, endTime)
    );
    blocksAuctionHouseContract.on(extendedFilter, (blockId, endTime) =>
      processAuctionExtended(blockId, endTime)
    );
    blocksAuctionHouseContract.on(settledFilter, (blockId, winner, amount) =>
      processAuctionSettled(blockId, winner, amount)
    );
  };
  loadState();

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(
    (state) => state.onDisplayAuction.lastAuctionBlockId
  );
  const { data } = useQuery(latestAuctionsQuery());
  const dispatch = useAppDispatch();

  useEffect(() => {
    data && dispatch(addPastAuctions({ data }));
  }, [data, latestAuctionId, dispatch]);

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ChainSubscriber />
      <React.StrictMode>
        <Web3ReactProvider
          getLibrary={
            (provider) => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
          }
        >
          <ApolloProvider client={client}>
            <PastAuctions />
            <DAppProvider config={useDappConfig}>
              <LanguageProvider>
                <App />
              </LanguageProvider>
              <Updaters />
            </DAppProvider>
          </ApolloProvider>
        </Web3ReactProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
