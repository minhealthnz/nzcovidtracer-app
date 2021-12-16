import { CheckInItemType } from "./entities/checkInItem";
import { LocationType } from "./entities/location";

export function getLocationType(locationType: CheckInItemType) {
  return locationType === CheckInItemType.Scan ||
    locationType === CheckInItemType.NFC ||
    locationType === CheckInItemType.Link
    ? LocationType.Scan
    : LocationType.Manual;
}
