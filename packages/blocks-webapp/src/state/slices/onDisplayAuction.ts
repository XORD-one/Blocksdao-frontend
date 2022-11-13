import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionBlockId: number | undefined;
  onDisplayAuctionBlockId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionBlockId: undefined,
  onDisplayAuctionBlockId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionBlockId: (state, action: PayloadAction<number>) => {
      state.lastAuctionBlockId = action.payload;
    },
    setOnDisplayAuctionBlockId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionBlockId = action.payload;
    },
    setPrevOnDisplayAuctionBlockId: state => {
      if (!state.onDisplayAuctionBlockId) return;
      if (state.onDisplayAuctionBlockId === 0) return;
      state.onDisplayAuctionBlockId = state.onDisplayAuctionBlockId - 1;
    },
    setNextOnDisplayAuctionBlockId: state => {
      if (state.onDisplayAuctionBlockId === undefined) return;
      if (state.lastAuctionBlockId === state.onDisplayAuctionBlockId) return;
      state.onDisplayAuctionBlockId = state.onDisplayAuctionBlockId + 1;
    },
  },
});

export const {
  setLastAuctionBlockId,
  setOnDisplayAuctionBlockId,
  setPrevOnDisplayAuctionBlockId,
  setNextOnDisplayAuctionBlockId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
