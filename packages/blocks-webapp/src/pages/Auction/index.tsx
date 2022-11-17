import Banner from "../../components/Banner";
import Auction from "../../components/Auction";
// import Documentation from "../../components/Documentation";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setOnDisplayAuctionBlockId } from "../../state/slices/onDisplayAuction";
import { push } from "connected-react-router";
import { nounPath } from "../../utils/history";
import useOnDisplayAuction from "../../wrappers/onDisplayAuction";
import { useEffect } from "react";

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = (props) => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(
    (state) => state.onDisplayAuction.lastAuctionBlockId
  );
  const onDisplayAuctionNounId = onDisplayAuction?.blockId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionBlockId(lastAuctionNounId));
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionBlockId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionBlockId(lastAuctionNounId));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <Auction auction={onDisplayAuction ? onDisplayAuction : undefined} />
      <Banner />

      {onDisplayAuctionNounId !== undefined &&
      onDisplayAuctionNounId !== lastAuctionNounId
        ? // <ProfileActivityFeed nounId={onDisplayAuctionNounId} />
          ""
        : // <Banner />
          ""}
      {/* <Documentation /> */}
    </>
  );
};
export default AuctionPage;
