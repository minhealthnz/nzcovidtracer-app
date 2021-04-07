import { ReduxState } from "@domain/types";
import { setSessionType } from "@features/onboarding/reducer";
import { createLogger } from "@logger/createLogger";
import AsyncStorage from "@react-native-community/async-storage";
import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { persistReducer } from "redux-persist";

import config from "../../config";
import { remove, upsert } from "../../db/checkInItem";
import {
  setCountedOldDiaries,
  setMatchedCheckInItem,
  setMatches,
} from "./commonActions";
import { mapCheckInItem, mapDiaryEntry } from "./mappers";
import {
  DiaryEntry,
  DiaryPaginationSession,
  DiaryState,
  ErrorState,
} from "./types";

export const persistConfig = {
  storage: AsyncStorage,
  key: "diary",
  whitelist: ["hasSeenScanTutorial"],
};

const INITIAL_STATE: DiaryState = {
  byId: {},
  hasSeenScanTutorial: false,
  userIds: [],
  sessions: {},
  shareDiary: {
    pending: false,
    fulfilled: false,
  },
  previewDiary: {
    pending: false,
  },
  copyDiary: {
    pending: false,
    fulfilled: false,
  },
  count: {},
  countActiveDays: 0,
  countedOldDiaries: false,
  debugging: {
    insertError: false,
  },
  matches: {},
};

const { logInfo, logError } = createLogger("diary/reducer");

export interface AddEntry {
  entry: DiaryEntry;
}

export const addEntry = createAsyncThunk(
  "diary/addEntry",
  async (request: AddEntry, { getState }) => {
    if (config.IsDev) {
      const state = getState() as ReduxState;
      if (state.diary.debugging.insertError) {
        throw new Error("Test error");
      }
    }

    await upsert(mapCheckInItem(request.entry));
    return request;
  },
);

export const editEntry = createAsyncThunk(
  "diary/editEntry",
  async (entry: DiaryEntry) => {
    await upsert(mapCheckInItem(entry));
    return entry;
  },
);

export const deleteEntry = createAsyncThunk(
  "diary/deleteEntry",
  async (id: string) => {
    await remove(id);
    return id;
  },
);

export const PageSize = 12;

export interface CheckInItemQuery {
  userIds: string[];
  from: Date;
  isRefresh: boolean;
}

export const loadNextPage = createAction<string>("diary/loadNextPage");

export interface AddLoadedEntries {
  sessionId: string;
  entries: DiaryEntry[];
}

export interface SetQuerying {
  sessionId: string;
  querying: boolean;
}

export interface StartPaginationSession {
  sessionId: string;
  userIds?: string[];
}

export interface ShareDiary {
  requestId: string;
  code: string;
}

export interface UpdatePreviewDiary {
  userId?: string;
  email?: string;
  isOnboarding?: boolean;
}

export interface CopyDiary {
  requestId: string;
  userId: string;
  email: string;
  isOnboarding: boolean;
}

export interface SetCount {
  userId: string;
  count: number;
}

const diarySlice = createSlice({
  name: "diary",
  initialState: INITIAL_STATE,
  reducers: {
    setHasSeenScanTutorial(state) {
      state.hasSeenScanTutorial = true;
    },
    setUserIds(state, { payload }: PayloadAction<string[]>) {
      state.userIds = payload;
    },
    addLoadedEntries(state, { payload }: PayloadAction<AddLoadedEntries>) {
      for (const entry of payload.entries) {
        state.byId[entry.id] = entry;
        mergeMatch(state, entry);
        state.sessions[payload.sessionId].allIds.push(entry.id);
      }
    },
    setQuerying(state, { payload }: PayloadAction<SetQuerying>) {
      if (state.sessions[payload.sessionId] == null) {
        return;
      }
      state.sessions[payload.sessionId].querying = payload.querying;
    },
    refresh(state, { payload }: PayloadAction<string>) {
      for (const id of state.sessions[payload].allIds) {
        delete state.byId[id];
      }
      state.sessions[payload].allIds = [];
    },
    startPaginationSession(
      state,
      { payload }: PayloadAction<StartPaginationSession>,
    ) {
      state.sessions[payload.sessionId] = {
        querying: false,
        allIds: [],
        userIds: payload.userIds ?? state.userIds,
      };
      const count = Object.keys(state.sessions).length;
      if (count > 3) {
        logError(
          "More than 3 pagination sessions found, is there a memory leak?",
        );
      }
    },
    stopPagniationSession(state, { payload }: PayloadAction<string>) {
      delete state.sessions[payload];
    },
    shareDiary(state, { payload }: PayloadAction<ShareDiary>) {
      state.shareDiary = {
        pending: true,
        fulfilled: false,
        requestId: payload.requestId,
      };
    },
    shareDiaryFulfilled(state) {
      state.shareDiary.pending = false;
      state.shareDiary.fulfilled = true;
    },
    shareDiaryRejected(state, { payload }: PayloadAction<ErrorState>) {
      state.shareDiary.pending = false;
      state.shareDiary.error = payload;
    },
    previewDiary(state) {
      state.previewDiary = {
        pending: true,
      };
    },
    updatePreviewDiary(state, { payload }: PayloadAction<UpdatePreviewDiary>) {
      if (payload.userId != null) {
        state.previewDiary.userId = payload.userId;
      }
      if (payload.email != null) {
        state.previewDiary.email = payload.email;
      }
      if (payload.isOnboarding != null) {
        state.previewDiary.isOnboarding = payload.isOnboarding;
      }
    },
    previewDiaryRejected(state, { payload }: PayloadAction<SerializedError>) {
      state.previewDiary.pending = false;
      state.previewDiary.error = payload;
    },
    previewDiaryFulfilled(state) {
      state.previewDiary.pending = false;
    },
    copyDiary(state, { payload }: PayloadAction<CopyDiary>) {
      state.copyDiary = {
        pending: true,
        fulfilled: false,
        requestId: payload.requestId,
        userId: payload.userId,
        email: payload.email,
        isOnboarding: payload.isOnboarding,
      };
    },
    copyDiaryRejected(state, { payload }: PayloadAction<SerializedError>) {
      state.copyDiary.pending = false;
      state.copyDiary.error = payload;
    },
    copyDiaryFulfilled(state) {
      state.copyDiary.pending = false;
      state.copyDiary.fulfilled = true;
    },
    setCount(state, { payload }: PayloadAction<SetCount>) {
      state.count[payload.userId] = payload.count;
    },
    setCountActiveDays(state, { payload }: PayloadAction<SetCount>) {
      state.countActiveDays = payload.count;
    },
    injectInsertError(state) {
      state.debugging.insertError = true;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addEntry.fulfilled, (state, { payload }) => {
        const entry = payload.entry;
        if (state.byId[entry.id] != null) {
          return;
        }

        const userId = entry.userId;
        state.byId[entry.id] = entry;
        Object.values(state.sessions).forEach((session) => {
          if (!session.userIds.includes(userId)) {
            return;
          }
          session.allIds.push(entry.id);
          reorderSession(state, session);
        });
      })
      .addCase(addEntry.rejected, (_state, action) => {
        logError(action.error);
      })
      .addCase(editEntry.fulfilled, (state, { payload }) => {
        if (state.byId[payload.id] == null) {
          return;
        }
        state.byId[payload.id] = payload;
        mergeMatch(state, payload);
        state.byId[payload.id].updatedAt = new Date().getTime();

        // Reorder lists in case if startDate was modified
        Object.values(state.sessions).forEach((session) => {
          if (!session.userIds.includes(payload.userId)) {
            return;
          }
          reorderSession(state, session);
        });
      })
      .addCase(editEntry.rejected, (_state, action) => {
        logError(action.error);
      })
      .addCase(deleteEntry.fulfilled, (state, { payload }) => {
        if (state.byId[payload] == null) {
          return;
        }

        delete state.byId[payload];

        Object.values(state.sessions).forEach((session) => {
          _.pull(session.allIds, payload);
        });
      })
      .addCase(deleteEntry.rejected, (_state, action) => {
        logError(action.error);
      })
      .addCase(setSessionType, (state, { payload }) => {
        if (payload === "single" || payload === "multi") {
          state.hasSeenScanTutorial = true;
        }
      })
      .addCase(setCountedOldDiaries, (state) => {
        state.countedOldDiaries = true;
      })
      .addCase(setMatchedCheckInItem, (state, { payload }) => {
        if (payload !== undefined) {
          const entry = mapDiaryEntry(payload);
          state.byId[entry.id] = entry;
          mergeMatch(state, entry);
        }
      })
      .addCase(setMatches, (state, { payload }) => {
        const matches = _.groupBy(
          payload,
          (match) => match.globalLocationNumberHash,
        );
        state.matches = matches;

        for (const id in state.byId) {
          const entry = state.byId[id];
          mergeMatch(state, entry);
        }
      })
      .addDefaultCase((_state, _action) => {}),
});

function reorderSession(state: DiaryState, session: DiaryPaginationSession) {
  const start = new Date();
  session.allIds = session.allIds.sort((a, b) => {
    return state.byId[b].startDate - state.byId[a].startDate;
  });
  logInfo(
    `Reordered session list, took ${new Date().getTime() - start.getTime()}ms`,
  );
}

const { actions, reducer } = diarySlice;

export const {
  setHasSeenScanTutorial,
  setUserIds,
  addLoadedEntries,
  setQuerying,
  refresh,
  startPaginationSession,
  stopPagniationSession,
  shareDiary,
  shareDiaryFulfilled,
  shareDiaryRejected,
  previewDiary,
  updatePreviewDiary,
  previewDiaryRejected,
  previewDiaryFulfilled,
  copyDiary,
  copyDiaryFulfilled,
  copyDiaryRejected,
  setCount,
  setCountActiveDays,
  injectInsertError,
} = actions;

export { reducer as _reducer };

export default persistReducer(persistConfig, reducer);

const mergeMatch = (state: DiaryState, entry: DiaryEntry) => {
  if (entry.globalLocationNumberHash) {
    if (state.matches[entry.globalLocationNumberHash] == null) {
      return;
    }

    state.matches[entry.globalLocationNumberHash].forEach((match) => {
      if (
        match.startDate.getTime() <= entry.startDate &&
        match.endDate.getTime() >= entry.startDate
      ) {
        state.byId[entry.id].isRisky = true;
        state.byId[entry.id].updatedAt = new Date().getTime();
        state.byId[entry.id].bannerTitle = match.appBannerTitle;
        state.byId[entry.id].bannerBody = match.appBannerBody;
      }
    });
  }
};
