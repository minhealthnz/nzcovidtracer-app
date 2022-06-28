import {
  Announcement as ApiAnnouncement,
  ENFNotificationSettings,
} from "@features/enfExposure/api";
import { retrievedSettings } from "@features/enfExposure/commonActions";
import { createLogger } from "@logger/createLogger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment-timezone";
import { persistReducer } from "redux-persist";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  linkText: string;
  link: string;
  createdAt: number;
  enabled: boolean;
  deepLink?: string;
}

export interface AnnouncementState {
  announcement?: Announcement;
  dismissed: { [id: string]: boolean };
}

const initialState: AnnouncementState = { dismissed: {} };

export const persistConfig = {
  storage: AsyncStorage,
  key: "announcement",
  whitelist: ["announcement", "dismissed"],
};

const mapAnnouncements = (input: ApiAnnouncement[]) => {
  return input.map((a) => {
    return {
      ...a,
      createdAt: moment(a.createdAt).valueOf(),
      id: a.createdAt,
    };
  });
};

const { logError } = createLogger("announcement/reducer");

const slice = createSlice({
  name: "announcements",
  reducers: {
    dismissAnnouncement(state) {
      if (state.announcement == null) {
        return;
      }
      state.dismissed[state.announcement.id] = true;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(
      retrievedSettings,
      (state, { payload }: PayloadAction<ENFNotificationSettings>) => {
        try {
          const results = mapAnnouncements(payload.announcements);
          state.announcement = results[0];
        } catch (err) {
          logError("Failed to parse announcements", err);
        }
      },
    ),
  initialState,
});

const { reducer, actions } = slice;

export const { dismissAnnouncement } = actions;

export default persistReducer(persistConfig, reducer);
