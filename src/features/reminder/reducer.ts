import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import { recordAnalyticEvent } from "../../analytics";
import { ReminderEvents } from "./events";

export const persistConfig = {
  storage: AsyncStorage,
  key: "reminder",
  blacklist: [],
};

export interface ReminderNotification {
  timingInMinutes: number;
  notificationMessage: string;
  dashboardTitle: string;
  dashboardBody: string;
  diaryTitle: string;
  diaryBody: string;
}

export interface ReminderNotificationConfig {
  version: number;
  notifications?: ReminderNotification[];
}

export interface InAppReminder {
  dateTime: Date;
  dashboardTitle: string;
  dashboardBody: string;
  diaryTitle: string;
  diaryBody: string;
}

export interface ReminderNotificationState {
  config: ReminderNotificationConfig;
  scheduledInAppReminders: InAppReminder[];
  currentlyDisplayedInAppReminder?: InAppReminder;
  isRemindersEnabled: boolean;
}

const initialState: ReminderNotificationState = {
  config: {
    version: 0,
    notifications: undefined,
  },
  scheduledInAppReminders: [],
  currentlyDisplayedInAppReminder: undefined,
  isRemindersEnabled: false,
};

const slice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    setReminderNotificationConfig(
      state,
      { payload }: PayloadAction<ReminderNotificationConfig>,
    ) {
      state.config = payload;
    },
    clearScheduledInAppReminders(state) {
      state.scheduledInAppReminders = [];
    },
    setScheduledInAppReminders(
      state,
      { payload }: PayloadAction<InAppReminder[]>,
    ) {
      state.scheduledInAppReminders = payload;
    },
    setCurrentlyDisplayedInAppReminder(
      state,
      { payload }: PayloadAction<InAppReminder>,
    ) {
      state.currentlyDisplayedInAppReminder = payload;
    },
    dismissInAppReminder(state) {
      state.currentlyDisplayedInAppReminder = undefined;
    },
    toggleRemindersEnabled(state) {
      state.isRemindersEnabled = !state.isRemindersEnabled;
      recordAnalyticEvent(ReminderEvents.ToggleReminders, {
        attributes: { state: state.isRemindersEnabled ? "on" : "off" },
      });
    },
  },
});

const { reducer, actions } = slice;

export const {
  setReminderNotificationConfig,
  clearScheduledInAppReminders,
  setScheduledInAppReminders,
  setCurrentlyDisplayedInAppReminder,
  dismissInAppReminder,
  toggleRemindersEnabled,
} = actions;

export default persistReducer(persistConfig, reducer);
