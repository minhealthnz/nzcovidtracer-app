import { DiaryEntryType } from "./types";

export const DiaryEvent = {
  DiaryEntryAdded: "diary_entry_added",
  DiaryImportInitiated: "diary_import_initiated",
  DiaryImportSucceed: "diary_import_succeeded",
  DiaryImportFailed: "diary_import_failed",
} as const;

export type DiaryEventPayloads = {
  [DiaryEvent.DiaryEntryAdded]: {
    attributes: { source: DiaryEntryType };
  };
};
