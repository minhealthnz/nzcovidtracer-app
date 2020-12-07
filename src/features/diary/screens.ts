export enum DiaryScreen {
  Navigator = "Diary/Navigator",
  ViewDiary = "Diary/ViewDiary",
  CopiedDiary = "Diary/CopiedDiary",
  Diary = "Diary/Diary",
  DiaryEntry = "Diary/DiaryEntry",
  EditEntry = "Diary/EditEntry",
  AddEntryManually = "Diary/AddEntryManually",
}

export type DiaryScreenParams = {
  [DiaryScreen.Navigator]: any;
  [DiaryScreen.ViewDiary]: {
    userId: string;
    email: string;
    isOnboarding: boolean;
  };
  [DiaryScreen.CopiedDiary]: { email: string; isOnboarding: boolean };
  [DiaryScreen.Diary]: undefined;
  [DiaryScreen.DiaryEntry]: { id: string };
  [DiaryScreen.AddEntryManually]: undefined;
  [DiaryScreen.EditEntry]: { id: string };
};
