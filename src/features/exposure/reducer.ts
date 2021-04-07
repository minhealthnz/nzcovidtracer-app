import { findByLocationNumberHash } from "@db/checkInItem";
import { CheckInItem } from "@db/checkInItem";
import {
  acknowledgeOutstandingMatches,
  CheckInItemMatch,
  getMostRecentUnacknowledgedMatch,
  setCallbackRequested,
} from "@db/checkInItemMatch";
import { ReduxState } from "@domain/types";
import {
  setMatchedCheckInItem,
  setMatches,
} from "@features/diary/commonActions";
import { isNetworkError } from "@lib/helpers";
import AsyncStorage from "@react-native-community/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import PushNotification from "react-native-push-notification";
import { persistReducer } from "redux-persist";

import { requestCallback as apiRequestCallback } from "./api";
import { processEvents } from "./service/processEvents";
import { errors, ExposureEvent } from "./service/types";

const getMatch = createAsyncThunk(
  "exposure/getMostRecentUnacknowledgedMatch",
  async () => {
    return await getMostRecentUnacknowledgedMatch();
  },
);

interface AddEvents {
  events: ExposureEvent[];
  defaultSystemNotificationBody: string;
}

const addEvents = createAsyncThunk(
  "exposure/addEvents",
  async ({ events, defaultSystemNotificationBody }: AddEvents) => {
    return await processEvents(events, defaultSystemNotificationBody);
  },
);

export interface RequestCallback {
  firstName: string;
  lastName: string;
  phone: string;
  notes?: string;
}

export const requestCallback = createAsyncThunk(
  "exposure/requestCallback",
  async (request: RequestCallback, { getState }) => {
    const { exposure } = getState() as ReduxState;
    if (exposure.match == null) {
      throw new Error("no matches found");
    }
    const checkIn = await findByLocationNumberHash(
      exposure.match.globalLocationNumberHash,
    );
    if (checkIn == null) {
      throw new Error("Check in not found");
    }
    try {
      await apiRequestCallback({
        eventId: exposure.match.eventId,
        notificationId: exposure.match.notificationId,
        gln: checkIn.globalLocationNumber,
        firstName: request.firstName,
        lastName: request.lastName,
        phone: request.phone.replace(/\s/g, ""),
        contactNotes: request.notes,
      });
    } catch (err) {
      if (isNetworkError(err)) {
        throw { code: errors.requestCallback.network };
      }
      throw err;
    }
    await setCallbackRequested(exposure.match.id);
    return await getMostRecentUnacknowledgedMatch();
  },
);

export interface NotificationUserInfo {
  type?: string;
  isLocal?: boolean;
}

const acknowledgeMatches = createAsyncThunk("exposure/dimiss", async () => {
  await acknowledgeOutstandingMatches();
  PushNotification.cancelAllLocalNotifications();
  return await getMostRecentUnacknowledgedMatch();
});

export interface ExposureState {
  match?: CheckInItemMatch;
  pollingDisabled: boolean;
  checkInItem?: CheckInItem;
  matches?: CheckInItemMatch[];
}

const initialState: ExposureState = {
  pollingDisabled: false,
};

export const persistConfig = {
  storage: AsyncStorage,
  key: "exposure",
  whitelist: ["pollingDisabled"],
};

const slice = createSlice({
  name: "exposure",
  initialState,
  reducers: {
    setMatch(state, { payload }: PayloadAction<CheckInItemMatch>) {
      state.match = payload;
    },
    disablePolling(state, { payload: flag }: PayloadAction<boolean>) {
      state.pollingDisabled = flag;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getMatch.fulfilled, (state, { payload }) => {
        state.match = payload;
      })
      .addCase(acknowledgeMatches.fulfilled, (state, { payload }) => {
        state.match = payload;
      })
      .addCase(addEvents.fulfilled, (state, { payload }) => {
        state.match = payload;
      })
      .addCase(requestCallback.fulfilled, (state, { payload }) => {
        state.match = payload;
      })
      .addCase(setMatchedCheckInItem, (state, { payload }) => {
        state.checkInItem = payload;
      })
      .addCase(setMatches, (state, { payload }) => {
        state.matches = payload;
      })
      .addDefaultCase((_state, _payload) => {}),
});

const { reducer } = slice;

export { getMatch, acknowledgeMatches, addEvents };
export const { setMatch, disablePolling } = slice.actions;

export default persistReducer(persistConfig, reducer);
