export interface Location {
  id: string;
  name: string;
  address: string;
  isFavourite: boolean;
  hasDiaryEntry: boolean;
  type: LocationType;
}

export enum LocationType {
  Scan = "scan",
  Manual = "manual",
}
