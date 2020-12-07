import { nanoid } from "@reduxjs/toolkit";

import {
  _reducer as reducer,
  addEntry,
  deleteEntry,
  editEntry,
} from "./reducer";
import { DiaryEntry, DiaryState } from "./types";

export default describe("Diary/reducer", () => {
  const userId = nanoid();
  const initialEntry: DiaryEntry = {
    userId,
    type: "scan",
    address: "Test",
    globalLocationNumber: "123",
    globalLocationNumberHash: "3245",
    id: "1",
    name: "Test",
    startDate: new Date().getTime(),
  };
  const initialEntries: DiaryEntry[] = [initialEntry];

  const newEntry: DiaryEntry = {
    userId,
    type: "scan",
    address: "Test2",
    globalLocationNumber: "1232",
    globalLocationNumberHash: "3235",
    id: "2",
    name: "Test2",
    startDate: new Date().getTime() + 1,
  };

  const moddedEntry: DiaryEntry = {
    userId,
    type: "scan",
    address: "Test3",
    globalLocationNumber: "4321",
    globalLocationNumberHash: "4321",
    id: "2",
    name: "Test22324",
    startDate: new Date().getTime(),
  };

  const buildInitialState = (
    entries: DiaryEntry[],
    sessionId: string,
  ): DiaryState => {
    return {
      byId: entries.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {} as { [id: string]: DiaryEntry }),
      hasSeenScanTutorial: false,
      userIds: [userId],
      sessions: {
        [sessionId]: {
          querying: false,
          allIds: entries.map((x) => x.id),
          userIds: [userId],
        },
      },
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
      countedOldDiaries: false,
      debugging: {
        insertError: false,
      },
    };
  };

  const getEntries = (state: DiaryState, sessionId: string) => {
    return state.sessions[sessionId].allIds.map((x) => state.byId[x]);
  };

  describe("addEntry.fullfilled", () => {
    const sessionId = nanoid();
    const initState = buildInitialState(initialEntries, sessionId);
    const request = {
      requestId: nanoid(),
      entry: newEntry,
    };

    const newState = reducer(
      initState! as DiaryState,
      addEntry.fulfilled(request, nanoid(), request),
    );

    it("should have the expected list of entries", () => {
      expect(getEntries(newState, sessionId)).toEqual([newEntry, initialEntry]);
    });
  });

  describe("editEntry.fullfilled", () => {
    const sessionId = nanoid();
    const initState = buildInitialState([newEntry, initialEntry], sessionId);

    const newState = reducer(
      initState as DiaryState,
      editEntry.fulfilled(moddedEntry, nanoid(), moddedEntry),
    );

    it("should have the expected modified list of entries", () => {
      expect(getEntries(newState, sessionId)).toEqual([
        moddedEntry,
        initialEntry,
      ]);
    });
  });

  describe("deleteEntry.fullfilled", () => {
    const sessionId = nanoid();
    const initState = buildInitialState([newEntry, initialEntry], sessionId);

    const newState = reducer(
      initState as DiaryState,
      deleteEntry.fulfilled("2", nanoid(), "2"),
    );

    it("should have deleted the entry with given id", () => {
      expect(getEntries(newState, sessionId)).toEqual([initialEntry]);
    });
  });
});
