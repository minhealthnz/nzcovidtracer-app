import { AddDiaryEntry } from "@features/diary/reducer";
import { DiaryEntryType } from "@features/diary/types";
import AsyncStorage from "@react-native-community/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

export interface NfcState {
  lastScannedEntry: {
    gln?: string;
    lastScanned?: Date;
    id?: string;
    type?: DiaryEntryType;
    name?: string;
  };
  nfcDebounce: boolean;
}

const persistConfig = {
  storage: AsyncStorage,
  key: "nfc",
  whitelist: ["lastScannedEntry", "nfcDebounce"],
};

const initialState: NfcState = {
  lastScannedEntry: {},
  nfcDebounce: false,
};

const slice = createSlice({
  name: "nfc",
  initialState,
  reducers: {
    setLastScannedEntry(state, { payload }: PayloadAction<AddDiaryEntry>) {
      state.lastScannedEntry = {
        lastScanned: new Date(),
        gln: payload.globalLocationNumber,
        id: payload.id,
        type: payload.type,
        name: payload.name,
      };
    },
    setNfcDebounce(state, { payload }: PayloadAction<boolean>) {
      state.nfcDebounce = payload;
    },
  },
});

const { reducer, actions } = slice;

export const { setLastScannedEntry, setNfcDebounce } = actions;

export default persistReducer(persistConfig, reducer);
