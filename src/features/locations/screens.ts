import { DiaryEntry } from "@features/diary/types";

export enum LocationScreen {
  SaveLocationOnboarding = "Location/SaveLocationOnboarding",
  SavedLocations = "Location/SavedLocations",
  SaveNewLocation = "Locations/SaveNewLocation",
  SaveNewLocationEmpty = "Locations/SaveNewLocationEmpty",
  PlaceOrActivity = "Locations/PlaceOrActivity",
  PickSavedLocation = "Locations/PickSavedLocation",
}

export type LocationScreenParams = {
  [LocationScreen.SaveLocationOnboarding]: {
    diaryEntry?: DiaryEntry;
    hasSeenLocationOnboarding?: boolean;
  };
  [LocationScreen.SavedLocations]: undefined;
  [LocationScreen.SaveNewLocation]: undefined;
  [LocationScreen.SaveNewLocationEmpty]: undefined;
  [LocationScreen.PlaceOrActivity]: {
    name?: string;
  };
  [LocationScreen.PickSavedLocation]: undefined;
};
