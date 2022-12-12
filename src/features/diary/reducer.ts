import {
  addCheckIn,
  addCheckIns,
  editCheckIn,
  findCheckInItemById,
  remove,
} from "@db/entities/checkInItem";
import { ReduxState } from "@domain/types";
import { addFavourite } from "@features/locations/actions/addFavourite";
import { removeFavourite } from "@features/locations/actions/removeFavourite";
import { createLogger } from "@logger/createLogger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { calcCheckInMinDate } from "@utils/checkInDate";
import _ from "lodash";
import { persistReducer } from "redux-persist";

import { AnalyticsEvent, recordAnalyticEvent } from "../../analytics";
import config from "../../config";
import {
  setCountedOldDiaries,
  setMatchedCheckInItem,
  setMatches,
} from "./commonActions";
import { DiaryEvent } from "./events";
import { mapDiaryEntry, mapUpsertCheckInItem } from "./mappers";
import {
  DiaryEntry,
  DiaryEntryType,
  DiaryPaginationSession,
  DiaryState,
  ErrorState,
  MergeEntryStatus,
} from "./types";

export const persistConfig = {
  storage: AsyncStorage,
  key: "diary",
  whitelist: [],
};

const INITIAL_STATE: DiaryState = {
  byId: {},
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
  byLocationId: {},
  mergeEntryStatus: { status: "idle" },
};

const { logInfo, logError } = createLogger("diary/reducer");

export interface AddDiaryEntry {
  id: string;
  userId: string;
  startDate: Date;
  name: string;
  address?: string;
  globalLocationNumber?: string;
  details?: string;
  type: DiaryEntryType;
  isFavourite?: boolean;
}

export interface EditDiaryEntry {
  id: string;
  details?: string;
  name?: string;
  startDate?: Date;
  userId?: string;
  type?: DiaryEntryType;
}

export const addEntry = createAsyncThunk(
  "diary/addEntry",
  async (request: AddDiaryEntry, { getState }) => {
    if (config.IsDev) {
      const state = getState() as ReduxState;
      if (state.diary.debugging.insertError) {
        throw new Error("Test error");
      }
    }

    await addCheckIn(mapUpsertCheckInItem(request));

    const checkIn = await findCheckInItemById(request.id);
    return mapDiaryEntry(checkIn);
  },
);

export const mergeEntries = createAsyncThunk(
  "diary/mergeEntries",
  async (request: AddDiaryEntry[]) => {
    recordAnalyticEvent(DiaryEvent.DiaryImportInitiated);
    const minDate = calcCheckInMinDate();

    const recentEntries = request.filter(
      (checkIn) => checkIn.startDate > minDate,
    );

    await addCheckIns(recentEntries.map(mapUpsertCheckInItem));

    const checkIns = await Promise.all(
      recentEntries.map(async (diary) => findCheckInItemById(diary.id)),
    );
    return checkIns.map((i) => mapDiaryEntry(i));
  },
);

export const editEntry = createAsyncThunk(
  "diary/editEntry",
  async (request: EditDiaryEntry) => {
    if (
      request.userId &&
      request.name &&
      request.type === "manual" &&
      request.startDate
    ) {
      await remove(request.id);
      await addCheckIn(
        mapUpsertCheckInItem({
          id: request.id,
          userId: request.userId,
          startDate: request.startDate,
          name: request.name,
          address: undefined,
          globalLocationNumber: undefined,
          details: request.details,
          type: "manual",
        }),
      );
    } else {
      await editCheckIn(request);
    }

    const checkIn = await findCheckInItemById(request.id);
    return mapDiaryEntry(checkIn);
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
  items: DiaryEntry[];
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

const upsertEntryToStore = (state: DiaryState, entry: DiaryEntry) => {
  state.byId[entry.id] = entry;
  if (state.byLocationId[entry.locationId] == null) {
    state.byLocationId[entry.locationId] = [];
  }
  if (state.byLocationId[entry.locationId].includes(entry.id)) {
    return;
  }
  state.byLocationId[entry.locationId].push(entry.id);
};

const deleteEntryFromStore = (state: DiaryState, entry: DiaryEntry) => {
  const entryIds = state.byLocationId[entry.locationId];
  const index = entryIds.findIndex((id) => id === entry.id);
  if (index !== -1) {
    entryIds.splice(index, 1);
  }
  delete state.byId[entry.id];
};

const diarySlice = createSlice({
  name: "diary",
  initialState: INITIAL_STATE,
  reducers: {
    setUserIds(state, { payload }: PayloadAction<string[]>) {
      state.userIds = payload;
    },
    addLoadedEntries(state, { payload }: PayloadAction<AddLoadedEntries>) {
      for (const entry of payload.entries) {
        upsertEntryToStore(state, entry);
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
        const entry = state.byId[id];
        deleteEntryFromStore(state, entry);
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
    setMergeEntryStatus(state, { payload }: PayloadAction<MergeEntryStatus>) {
      state.mergeEntryStatus = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addEntry.fulfilled, (state, { payload: entry }) => {
        updateSession(state, entry);
        recordAnalyticEvent(AnalyticsEvent.DiaryEntryAdded, {
          attributes: { source: entry.type },
        });
      })
      .addCase(addEntry.rejected, (_state, action) => {
        logError(action.error);
      })
      .addCase(mergeEntries.pending, (state, _action) => {
        state.mergeEntryStatus = { status: "loading" };
      })
      .addCase(mergeEntries.fulfilled, (state, { payload: entries }) => {
        for (const entry of entries) {
          updateSession(state, entry);
        }
        state.mergeEntryStatus = {
          status: "succeeded",
          message: "Your diary was successfully imported and merged",
        };
        recordAnalyticEvent(DiaryEvent.DiaryImportSucceed);
      })
      .addCase(mergeEntries.rejected, (state, action) => {
        state.mergeEntryStatus = {
          status: "failed",
          message:
            "Could not import this file. Make sure you’ve selected a valid file",
        };
        recordAnalyticEvent(DiaryEvent.DiaryImportFailed);
        logError(action.error);
      })
      .addCase(editEntry.fulfilled, (state, { payload }) => {
        if (state.byId[payload.id] == null) {
          return;
        }
        const entry = state.byId[payload.id];
        // handle multiple diaryEntries with the same location
        const isNameChanged = entry.name !== payload.name;

        if (state.byLocationId[entry.locationId].length > 1 && isNameChanged) {
          deleteEntryFromStore(state, entry);

          Object.values(state.sessions).forEach((session) => {
            _.pull(session.allIds, payload.id);
          });
          upsertEntryToStore(state, payload);
          mergeMatch(state, payload);

          Object.values(state.sessions).forEach((session) => {
            if (!session.userIds.includes(payload.userId)) {
              return;
            }
            session.allIds.push(payload.id);
            reorderSession(state, session);
          });
        } else {
          upsertEntryToStore(state, payload);
          mergeMatch(state, payload);
          entry.updatedAt = new Date().getTime();

          // Reorder lists in case if startDate was modified
          Object.values(state.sessions).forEach((session) => {
            if (!session.userIds.includes(payload.userId)) {
              return;
            }
            reorderSession(state, session);
          });
        }
      })
      .addCase(editEntry.rejected, (_state, action) => {
        logError(action.error);
      })
      .addCase(deleteEntry.fulfilled, (state, { payload }) => {
        if (state.byId[payload] == null) {
          return;
        }

        const entry = state.byId[payload];
        deleteEntryFromStore(state, entry);

        Object.values(state.sessions).forEach((session) => {
          _.pull(session.allIds, payload);
        });
      })
      .addCase(deleteEntry.rejected, (_state, action) => {
        logError(action.error);
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
      .addCase(addFavourite.fulfilled, (state, { payload: locationId }) => {
        const entryIds = state.byLocationId[locationId];
        if (entryIds == null) {
          return;
        }
        for (const entryId of entryIds) {
          if (state.byId[entryId] != null) {
            state.byId[entryId].isFavourite = true;
          }
        }
      })
      .addCase(removeFavourite.fulfilled, (state, { payload: locationId }) => {
        const entryIds = state.byLocationId[locationId];
        if (entryIds == null) {
          return;
        }
        for (const entryId of entryIds) {
          if (state.byId[entryId] != null) {
            state.byId[entryId].isFavourite = false;
          }
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
  setMergeEntryStatus,
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

const updateSession = (state: DiaryState, entry: DiaryEntry) => {
  if (state.byId[entry.id] != null) {
    return;
  }

  const userId = entry.userId;
  upsertEntryToStore(state, entry);
  Object.values(state.sessions).forEach((session) => {
    if (!session.userIds.includes(userId)) {
      return;
    }
    session.allIds.push(entry.id);
    reorderSession(state, session);
  });
};
