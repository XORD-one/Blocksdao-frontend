import { BigNumber } from "ethers";
import classes from "./AuctionActivityNounTitle.module.css";
import { Trans } from "@lingui/macro";
import { useEffect } from "react";

const AuctionActivityNounTitle: React.FC<{
  nounId: BigNumber;
  isCool?: boolean;
}> = (props) => {
  const { nounId, isCool } = props;

  useEffect(() => {}, [nounId]);

  return (
    <div className={classes.wrapper}>
      <h1
        style={{
          color: isCool
            ? "var(--brand-cool-dark-text)"
            : "var(--brand-warm-dark-text)",
        }}
      >
        Block {Number(nounId._hex)}
        Block {parseInt(nounId._hex)}
        Block {parseInt(nounId._hex, 16)}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
