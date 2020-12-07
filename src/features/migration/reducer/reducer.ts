import AsyncStorage from "@react-native-community/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

export interface MigrationState {
  usersCopied?: boolean;
  checkInsCopied?: boolean;
  matchesCopied?: boolean;
}

const initialState: MigrationState = {
  usersCopied: undefined,
  checkInsCopied: undefined,
  matchesCopied: undefined,
};

export const persistConfig = {
  storage: AsyncStorage,
  key: "migration",
  whitelist: ["usersCopied", "checkInsCopied", "matchesCopied"],
};

const slice = createSlice({
  name: "migration",
  initialState,
  reducers: {
    setUsersCopied(state, { payload }: PayloadAction<boolean>) {
      state.usersCopied = payload;
    },
    setCheckInsCopied(state, { payload }: PayloadAction<boolean>) {
      state.checkInsCopied = payload;
    },
    setMatchesCopied(state, { payload }: PayloadAction<boolean>) {
      state.matchesCopied = payload;
    },
  },
  extraReducers: {},
});

const { reducer, actions } = slice;

export const { setUsersCopied, setCheckInsCopied, setMatchesCopied } = actions;

export { reducer as _reducer };

export default persistReducer(persistConfig, slice.reducer);
