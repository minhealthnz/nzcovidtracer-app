export enum ENFScreen {
  Navigator = "ENF/Navigator",
  Settings = "ENF/Settings",
  Share = "ENF/Share",
  ShareSuccess = "ENF/ShareSuccess",
  NotSupported = "ENF/NotSupported",
}

export type ENFScreenParams = {
  [ENFScreen.Navigator]: undefined;
  [ENFScreen.Settings]: undefined;
  [ENFScreen.Share]: undefined;
  [ENFScreen.ShareSuccess]: undefined;
  [ENFScreen.NotSupported]: undefined;
};
