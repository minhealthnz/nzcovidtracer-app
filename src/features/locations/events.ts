import { Events } from "analytics/events";

export type LocationEventPayloads = {
  [Events.EntryPass]: {
    attributes: { entryType: string };
  };
};
