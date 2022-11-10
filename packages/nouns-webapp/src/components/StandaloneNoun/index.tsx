import { ImageData as data, getNounData } from "../../@blocks/assets";

import { buildSVG } from "../../@blocks/sdk";
import { BigNumber as EthersBN } from "ethers";
import { IBlockSeed, useNounSeed } from "../../wrappers/nounToken";
import Noun from "../Noun"; 
import { Link } from "react-router-dom";
import classes from "./StandaloneNoun.module.css";
import { useDispatch } from "react-redux";
import { setOnDisplayAuctionNounId } from "../../state/slices/onDisplayAuction";
import nounClasses from "../Noun/Noun.module.css";

interface StandaloneNounProps {
  nounId: EthersBN;
}
interface StandaloneCircularNounProps {
  nounId: EthersBN;
  border?: boolean;
}

interface StandaloneNounWithSeedProps {
  nounId: EthersBN;
  onLoadSeed?: (seed: IBlockSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getNoun = (nounId: string | EthersBN, seed: IBlockSeed) => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Noun ${id} is a member of the Nouns DAO`;
  const { parts, background } = getNounData(seed);
  console.log("parts:background", parts, background);

  const image = `data:image/svg+xml;base64,${btoa(
    buildSVG(parts, data.palette, background)
  )}`;

  console.log("image", image);

  return {
    name,
    description,
    image,
  };
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (
  props: StandaloneNounProps
) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={"/noun/" + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ""}
        alt={noun ? noun.description : "Noun"}
      />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps
) => {
  const { nounId, border } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  if (!seed || !nounId) return <Noun imgPath="" alt="Noun" />;

  return (
    <Link
      to={"/noun/" + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ""}
        alt={noun ? noun.description : "Noun"}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={border ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounRoundedCorners: React.FC<StandaloneNounProps> = (
  props: StandaloneNounProps
) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={"/noun/" + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ""}
        alt={noun ? noun.description : "Noun"}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = (
  props: StandaloneNounWithSeedProps
) => {
  const { nounId, onLoadSeed, shouldLinkToProfile } = props;

  const dispatch = useDispatch();
  const seed = useNounSeed(nounId);
  console.log("seed", seed);
  const seedIsInvalid = Object.values(seed || {}).every((v) => v === 0);

  if (!seed || seedIsInvalid || !nounId || !onLoadSeed)
    return <Noun imgPath="" alt="Noun" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  const { image, description } = getNoun(nounId, seed);

  const noun = <Noun imgPath={image} alt={description} />;
  const nounWithLink = (
    <Link
      to={"/noun/" + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export default StandaloneNoun;
