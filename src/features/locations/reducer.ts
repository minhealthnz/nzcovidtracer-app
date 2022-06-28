import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

export interface LocationsState {
  hasSeenLocationOnboarding: boolean;
  hasFavourites: boolean;
  hasDiaryEntries: boolean;
}

const initialState: LocationsState = {
  hasSeenLocationOnboarding: false,
  hasFavourites: false,
  hasDiaryEntries: false,
};

export const persistConfig = {
  storage: AsyncStorage,
  key: "locations",
  whitelist: ["hasSeenLocationOnboarding", "hasFavourites", "hasDiaryEntries"],
};

const slice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setHasFavourites(state, { payload }: PayloadAction<boolean>) {
      state.hasFavourites = payload;
    },
    setHasSeenLocationOnboarding(state) {
      state.hasSeenLocationOnboarding = true;
    },
    setHasDiaryEntries(state, { payload }: PayloadAction<boolean>) {
      state.hasDiaryEntries = payload;
    },
  },
});

const { reducer, actions } = slice;

export const {
  setHasSeenLocationOnboarding,
  setHasFavourites,
  setHasDiaryEntries,
} = actions;

export default persistReducer(persistConfig, reducer);
