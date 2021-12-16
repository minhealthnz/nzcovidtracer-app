import { Location } from "@features/locations/types";

import { DiaryEntry as DiaryEntryType } from "./types";

export enum DiaryScreen {
  Navigator = "Diary/Navigator",
  ViewDiary = "Diary/ViewDiary",
  CopiedDiary = "Diary/CopiedDiary",
  Diary = "Diary/Diary",
  DiaryEntry = "Diary/DiaryEntry",
  EditEntry = "Diary/EditEntry",
  AddEntryManually = "Diary/AddEntryManually",
  ShareDiary = "Diary/ShareDiary",
  ShareDiaryList = "Diary/ShareDiaryList",
  ShareDiaryConfirm = "Diary/ShareDiaryConfirm",
  DiaryShared = "Diary/DiaryShared",
}

export type DiaryScreenParams = {
  [DiaryScreen.ViewDiary]: {
    userId: string;
    email: string;
    isOnboarding: boolean;
  };
  [DiaryScreen.CopiedDiary]: { email: string; isOnboarding: boolean };
  [DiaryScreen.Diary]: undefined;
  [DiaryScreen.DiaryEntry]: { id: string };
  [DiaryScreen.AddEntryManually]:
    | { startDate?: number; location?: Location | string }
    | undefined;
  [DiaryScreen.EditEntry]: { id: string };
  [DiaryScreen.ShareDiary]: undefined;
  [DiaryScreen.DiaryShared]: undefined;
  [DiaryScreen.ShareDiaryList]: undefined;
  [DiaryScreen.ShareDiaryConfirm]: { items: DiaryEntryType[] };
};
