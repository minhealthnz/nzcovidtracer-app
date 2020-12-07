import { createAction } from "@reduxjs/toolkit";

/**
 * Event for finished counting old diaries, payload is true if there are any old diaries
 */
export const setCountedOldDiaries = createAction<boolean>(
  "diary/setCountedOldDiaries",
);
