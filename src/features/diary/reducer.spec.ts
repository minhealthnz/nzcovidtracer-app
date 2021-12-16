import { hashLocationNumber } from "@db/hashLocationNumber";
import { addFavourite } from "@features/locations/actions/addFavourite";
import { removeFavourite } from "@features/locations/actions/removeFavourite";
import { nanoid } from "@reduxjs/toolkit";

import { mapAddDiaryEntry } from "./mappers";
import {
  _reducer as reducer,
  AddDiaryEntry,
  addEntry,
  deleteEntry,
  editEntry,
  mergeEntries,
} from "./reducer";
import { DiaryEntry, DiaryState } from "./types";

const buildEntry = (partial?: Partial<DiaryEntry>): DiaryEntry => {
  const gln = nanoid();
  return {
    userId: nanoid(),
    type: "scan",
    address: nanoid(),
    globalLocationNumber: gln,
    globalLocationNumberHash: hashLocationNumber(gln),
    id: nanoid(),
    name: nanoid(),
    startDate: new Date(Math.random()).getTime(),
    isFavourite: false,
    locationId: nanoid(),
    ...partial,
  };
};

export const buildRandomEntries = (): DiaryEntry[] => {
  // numberOfEntries from 1 to 11
  const numberOfentries = Math.floor(Math.random() * 11) + 1;

  const diaryEntries: DiaryEntry[] = [];

  for (let i = 0; i < numberOfentries; i++) {
    const isFavourite = i % 2 === 0 ? true : false;

    const gln = nanoid();

    diaryEntries.push({
      userId: nanoid(),
      type: "scan",
      address: nanoid(),
      globalLocationNumber: gln,
      globalLocationNumberHash: hashLocationNumber(gln),
      id: nanoid(),
      name: nanoid(),
      startDate: new Date(Math.random()).getTime(),
      isFavourite: isFavourite,
      locationId: nanoid(),
    });
  }

  return diaryEntries;
};

const buildCases = (entries: AddDiaryEntry[]) => {
  const cases: any[] = [];
  entries.map((entry) => {
    cases.push([entry.id, entry]);
  });
  return cases;
};

const buildInitialState = (
  entries: DiaryEntry[],
  userId: string,
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
    countActiveDays: 0,
    countedOldDiaries: false,
    debugging: {
      insertError: false,
    },
    matches: {},
    mergeEntryStatus: { status: "idle" },
    byLocationId: entries.reduce((map, item) => {
      if (map[item.locationId] == null) {
        map[item.locationId] = [];
      }
      map[item.locationId].push(item.id);
      return map;
    }, {} as { [locationId: string]: string[] }),
  };
};

const getEntries = (state: DiaryState, sessionId: string) => {
  return state.sessions[sessionId].allIds.map((x) => state.byId[x]);
};

export default describe("Diary/reducer", () => {
  describe("addEntry.fullfilled", () => {
    const entry = buildEntry();
    const sessionId = nanoid();
    const initState = buildInitialState([], entry.userId, sessionId);

    const newState = reducer(
      initState! as DiaryState,
      addEntry.fulfilled(entry, nanoid(), {
        id: entry.id,
        userId: entry.id,
        startDate: new Date(entry.startDate),
        name: entry.name,
        address: entry.address ?? "",
        globalLocationNumber: entry.globalLocationNumber ?? "",
        details: entry.details,
        type: entry.type,
      }),
    );

    it("should have the expected list of entries", () => {
      expect(newState.byId[entry.id]).toEqual(entry);
    });

    it("adds entry to byLocationId", () => {
      expect(newState.byLocationId[entry.locationId]).toContain(entry.id);
    });
  });

  describe("mergeEntries.fullfilled", () => {
    const entries = buildRandomEntries();
    const userId = nanoid();
    const sessionId = nanoid();
    const initState = buildInitialState([], userId, sessionId);

    const diaryEntries = entries.map(mapAddDiaryEntry(userId));

    const newState = reducer(
      initState! as DiaryState,
      mergeEntries.fulfilled(entries, nanoid(), diaryEntries),
    );

    it.each(buildCases(diaryEntries))(
      "should match the location name",
      (id, entry) => {
        expect(newState.byId[id].name).toEqual(entry.name);
        expect(newState.byId[id].isFavourite).toEqual(entry.isFavourite);
      },
    );
  });

  describe("editEntry.fullfilled", () => {
    const sessionId = nanoid();
    const entry = buildEntry();
    const initState = buildInitialState([entry], entry.userId, sessionId);

    const editRequest = {
      id: entry.id,
      details: nanoid(),
      name: nanoid(),
      startDate: new Date(Math.random()),
    };

    const newState = reducer(
      initState as DiaryState,
      editEntry.fulfilled(
        {
          ...entry,
          ...editRequest,
          startDate: editRequest.startDate.getTime(),
        },
        nanoid(),
        editRequest,
      ),
    );

    it("should have the expected modified list of entries", () => {
      const edittedEntry = newState.byId[entry.id];
      expect(edittedEntry.details).toEqual(editRequest.details);
      expect(edittedEntry.name).toEqual(editRequest.name);
      expect(edittedEntry.startDate).toEqual(editRequest.startDate.getTime());
    });

    it("updates entry in byLocationId", () => {
      expect(newState.byLocationId[entry.locationId]).toContain(entry.id);
    });
  });

  describe("deleteEntry.fullfilled", () => {
    const sessionId = nanoid();
    const entry = buildEntry();
    const initState = buildInitialState([entry], entry.userId, sessionId);

    const newState = reducer(
      initState as DiaryState,
      deleteEntry.fulfilled(entry.id, nanoid(), entry.id),
    );

    it("should have deleted the entry with given id", () => {
      expect(getEntries(newState, sessionId)).toEqual([]);
    });

    it("should remove record by byLocationId", () => {
      expect(newState.byLocationId[entry.locationId]).not.toContain(entry.id);
    });
  });

  describe("addFavourite.fulfilled", () => {
    it("sets favourite to true for all check ins with matching locationId", () => {
      const userId = nanoid();
      const locationId = nanoid();
      const entry1 = buildEntry({ userId, locationId });
      const entry2 = buildEntry({ userId, locationId });
      const initState = buildInitialState([entry1, entry2], userId, nanoid());
      const newState = reducer(
        initState,
        addFavourite.fulfilled(locationId, nanoid(), { locationId }),
      );
      expect(newState.byId[entry1.id].isFavourite).toBe(true);
      expect(newState.byId[entry2.id].isFavourite).toBe(true);
      expect(newState.byLocationId[locationId]).toContain(entry1.id);
      expect(newState.byLocationId[locationId]).toContain(entry2.id);
    });
  });

  describe("removeFavourite.fullfilled", () => {
    it("sets favourite to false for all check ins with matching locationId", () => {
      const userId = nanoid();
      const locationId = nanoid();
      const entry1 = buildEntry({ userId, locationId, isFavourite: true });
      const entry2 = buildEntry({ userId, locationId, isFavourite: true });
      const initState = buildInitialState([entry1, entry2], userId, nanoid());
      const newState = reducer(
        initState,
        removeFavourite.fulfilled(locationId, nanoid(), { locationId }),
      );
      expect(newState.byId[entry1.id].isFavourite).toBe(false);
      expect(newState.byId[entry2.id].isFavourite).toBe(false);
      expect(newState.byLocationId[locationId]).toContain(entry1.id);
      expect(newState.byLocationId[locationId]).toContain(entry2.id);
    });
  });
});
