export enum NHIScreen {
  Navigator = "NHI/Navigator",
  Privacy = "NHI/Privacy",
  View = "NHI/Diary",
  Add = "NHI/ViewDiary",
  Added = "NHI/CopiedDiary",
}

export type NHIScreenParams = {
  [NHIScreen.Navigator]: undefined;
  [NHIScreen.Privacy]: undefined;
  [NHIScreen.View]: undefined;
  [NHIScreen.Add]: undefined;
  [NHIScreen.Added]: undefined;
};
