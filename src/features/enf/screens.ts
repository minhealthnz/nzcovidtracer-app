export enum ENFScreen {
  Settings = "ENF/Settings",
  Share = "ENF/Share",
  ShareSuccess = "ENF/ShareSuccess",
  NotSupported = "ENF/NotSupported",
}

export type ENFScreenParams = {
  [ENFScreen.Settings]: { retryPassed?: string } | undefined;
  [ENFScreen.Share]: undefined;
  [ENFScreen.ShareSuccess]: undefined;
  [ENFScreen.NotSupported]: undefined;
};
