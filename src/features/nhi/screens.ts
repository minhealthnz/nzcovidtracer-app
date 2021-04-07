export enum NHIScreen {
  Privacy = "NHI/Privacy",
  View = "NHI/Diary",
  Add = "NHI/ViewDiary",
  Added = "NHI/CopiedDiary",
}

export type NHIScreenParams = {
  [NHIScreen.Privacy]: undefined;
  [NHIScreen.View]: undefined;
  [NHIScreen.Add]: undefined;
  [NHIScreen.Added]: undefined;
};
