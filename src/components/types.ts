export interface RemoteSectionData {
  title?: string;
  data: (RemoteCardData | RemotePanelData | RemoteInfoBlockData)[];
}

export interface RemoteCardData {
  component: "Card";
  title: string;
  body?: string;
  backgroundColor?: string;
  icon?: string;
  externalLink?: string;
  deepLink?: string;
  action?: "share-app";
}

export interface RemotePanelData {
  component: "Panel";
  title: string;
  body: string;
  backgroundColor?: string;
  buttons: RemotePanelButtonData[];
}

export interface RemotePanelButtonData {
  text: string;
  externalLink?: string;
  deepLink?: string;
  accessibilityHint?: string;
}

export interface RemoteInfoBlockData {
  component: "InfoBlock";
  icon: string;
  backgroundColor?: string;
  title: string;
  body: string;
}

export interface RemoteSectionListData {
  sections: RemoteSectionData[];
}
