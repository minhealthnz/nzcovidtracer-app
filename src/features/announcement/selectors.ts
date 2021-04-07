import { ReduxState } from "@domain/types";
import { createSelector } from "reselect";

const selectRoot = (state: ReduxState) => state.announcement;

export const selectAnnouncement = createSelector(selectRoot, (root) => {
  if (root.announcement == null) {
    return undefined;
  }
  if (root.dismissed[root.announcement.id]) {
    return undefined;
  }
  if (!root.announcement.enabled) {
    return undefined;
  }
  return root.announcement;
});
