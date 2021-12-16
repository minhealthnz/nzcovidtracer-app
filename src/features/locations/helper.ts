import { Location } from "./types";

export function getLocationName(location: Location | string) {
  if (typeof location === "object") {
    return location.name;
  } else {
    return location;
  }
}
