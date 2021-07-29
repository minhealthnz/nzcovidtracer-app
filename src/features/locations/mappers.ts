import {
  Location as DbLocation,
  LocationType as DbLocationType,
} from "../../db/entities/location";
import { Location, LocationType } from "./types";

export const mapLocation = (location: DbLocation): Location => {
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    isFavourite: location.isFavourite,
    hasDiaryEntry: location.hasDiaryEntry,
    type: mapLocationType(location.type),
  };
};

const mapLocationType = (locationType: DbLocationType): LocationType => {
  switch (locationType) {
    case DbLocationType.Manual:
      return LocationType.Manual;
    case DbLocationType.Scan:
      return LocationType.Scan;
  }
};
