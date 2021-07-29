import { DiaryEntryType } from "./types";

export const DiaryEvent = {
  DiaryEntryAdded: "diary_entry_added",
} as const;

export type DiaryEventPayloads = {
  [DiaryEvent.DiaryEntryAdded]: {
    attributes: { source: DiaryEntryType };
  };
};
