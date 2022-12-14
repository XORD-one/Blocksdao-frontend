// @ts-nocheck
import { Col } from "react-bootstrap";
import { StandaloneNounWithSeed } from "../StandaloneNoun";
import AuctionActivity from "../AuctionActivity";
import { Row, Container } from "react-bootstrap";
import { setStateBackgroundColor } from "../../state/slices/application";
import { LoadingNoun } from "../Noun";
import { Auction as IAuction } from "../../wrappers/nounsAuction";
import classes from "./Auction.module.css";
import { INounSeed } from "../../wrappers/nounToken";
import NounderNounContent from "../NounderNounContent";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { isNounderNoun } from "../../utils/nounderNoun";
import {
  setNextOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
} from "../../state/slices/onDisplayAuction";
import { beige, grey } from "../../utils/nounBgColors";
// import { motion } from "framer-motion/dist/framer-motion";
// import head from "../../assets/head.svg";

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = (props) => {
  const { auction: currentAuction } = props;
  console.log("currentAuction", currentAuction);
  const history = useHistory();
  const dispatch = useAppDispatch();

  let stateBgColor = useAppSelector(
    (state) => state && state.application.stateBackgroundColor
  );
  const lastNounId = useAppSelector(
    (state) => state.onDisplayAuction.lastAuctionNounId
  );

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionNounId());
    currentAuction &&
      history.push(`/noun/${currentAuction.nounId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionNounId());
    currentAuction &&
      history.push(`/noun/${currentAuction.nounId.toNumber() + 1}`);
  };

  const nounContent = currentAuction && (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed
        nounId={currentAuction.nounId}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  console.log("nounContent", nounContent);

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <LoadingNoun />
    </div>
  );

  console.log("loadingNoun", loadingNoun);

  const currentAuctionActivityContent = currentAuction && lastNounId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={currentAuction.nounId.eq(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderNounContent = currentAuction && lastNounId && (
    <NounderNounContent
      mintTimestamp={currentAuction.startTime}
      nounId={currentAuction.nounId}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={currentAuction.nounId.eq(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {/* This is where the nft art is rendered || commenting it for now */}
            {currentAuction ? nounContent : loadingNoun}
            {/* <motion.div
              layout
              transition={{ duration: 0.3 }}
              animate={{
                rotate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 360],
                scale: [0.7, 0.8, 0.8, 0.9, 0.9, 0.9, 1, 1, 1, 1.1],
                opacity: [1, 1, 1, 0.8, 1, 1, 1, 1, 1, 1],
                transition: {
                  duration: 1,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  loop: Infinity,
                  repeatDelay: 2,
                },
              }}
            >
              <img src={head} alt="ds" width="300" />
            </motion.div> */}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderNoun(currentAuction.nounId)
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
