import { ReduxState } from "@domain/types";
import { User } from "@domain/user/types";
import { createSelector } from "reselect";

export const selectUser = (state: ReduxState) => state.user;
export const selectDiary = (state: ReduxState) => state.diary;

export const selectById = createSelector(selectDiary, (diary) => diary.byId);

export const selectHasSeenScanTutorial = createSelector(
  selectDiary,
  (diary) => diary.hasSeenScanTutorial,
);

export const selectSessions = createSelector(
  selectDiary,
  (diary) => diary.sessions,
);

export const selectShareDiary = createSelector(
  selectDiary,
  (diary) => diary.shareDiary,
);

export const selectUserIds = createSelector(
  selectDiary,
  (diary) => diary.userIds,
);

export const selectPreviewDiary = createSelector(
  selectDiary,
  (diary) => diary.previewDiary,
);

export const selectCopyDiary = createSelector(
  selectDiary,
  (diary) => diary.copyDiary,
);

export const selectCount = createSelector(selectDiary, (diary) => diary.count);

export const selectHasDiaryEntries = createSelector(
  selectDiary,
  selectUser,
  (diary, user) => {
    if (user.anonymousUserId === null) {
      return false;
    }
    for (const userId in diary.count) {
      if (userId === user.anonymousUserId) {
        return diary.count[userId] > 0;
      }
    }
    return false;
  },
);

export const selectCountActiveDays = createSelector(
  selectDiary,
  (diary) => diary.countActiveDays,
);

export const selectCountedOldDiaries = createSelector(
  selectDiary,
  (diary) => diary.countedOldDiaries,
);

export const selectHasOldDiary = createSelector(
  selectUser,
  selectDiary,
  (user, diary) => {
    if (user.anonymousUserId == null) {
      return false;
    }
    for (const userId in diary.count) {
      if (userId === user.anonymousUserId) {
        continue;
      }
      // Skip already linked
      const legacyUser: User = user.byId[userId];
      if (legacyUser.alias === user.anonymousUserId) {
        continue;
      }
      const number = diary.count[userId];
      if (number > 0) {
        return true;
      }
    }
    return false;
  },
);
