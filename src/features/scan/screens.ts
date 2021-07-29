export enum ScanScreen {
  Navigator = "Scan/Navigator",
  RecordVisit = "Scan/RecordVisit",
  Recorded = "Scan/Recorded",
  Tutorial = "Scan/Tutorial",
  TutorialNavigator = "Scan/TutorialNavigator",
  ScanNotRecorded = "Scan/ScanNotRecorded",
}

export type ScanScreenParams = {
  [ScanScreen.Recorded]: {
    id: string;
    nfcDebounce?: boolean;
    manualEntry?: boolean;
  };
  [ScanScreen.ScanNotRecorded]: undefined;
};
