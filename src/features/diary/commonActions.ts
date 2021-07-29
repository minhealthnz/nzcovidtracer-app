import { CheckInItem } from "@db/entities/checkInItem";
import { CheckInItemMatch } from "@db/entities/checkInItemMatch";
import { createAction } from "@reduxjs/toolkit";

/**
 * Event for finished counting old diaries, payload is true if there are any old diaries
 */
export const setCountedOldDiaries = createAction<boolean>(
  "diary/setCountedOldDiaries",
);

export const setMatchedCheckInItem = createAction<CheckInItem | undefined>(
  "diary/setChckInItem",
);

export const setMatches = createAction<CheckInItemMatch[]>("diary/setMatches");
