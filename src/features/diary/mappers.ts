import {
  AddCheckInItem,
  CheckInItem,
  CheckInItemType,
} from "../../db/entities/checkInItem";
import { AddDiaryEntry } from "./reducer";
import { DiaryEntry, DiaryEntryType } from "./types";

export const mapUpsertCheckInItem = (
  addEntry: AddDiaryEntry,
): AddCheckInItem => {
  return {
    ...addEntry,
    type: mapCheckInType(addEntry.type),
    globalLocationNumber: addEntry.globalLocationNumber ?? "",
    address: addEntry.address ?? "",
    note: addEntry.details,
  };
};

export const mapCheckInType = (type: DiaryEntryType) => {
  switch (type) {
    case "scan":
      return CheckInItemType.Scan;
    case "manual":
      return CheckInItemType.Manual;
    case "nfc":
      return CheckInItemType.NFC;
  }
};

export const mapDiaryEntryType = (type: CheckInItemType): DiaryEntryType => {
  switch (type) {
    case 0:
      return "scan";
    case 1:
      return "manual";
    case 2:
      return "nfc";
    default:
      return "scan";
  }
};

export const mapDiaryEntry = (checkInItem: CheckInItem): DiaryEntry => ({
  ...checkInItem,
  type: mapDiaryEntryType(checkInItem.type),
  startDate: checkInItem.startDate.getTime(),
  endDate: checkInItem.endDate?.getTime(),
  details: checkInItem.note,
  name: checkInItem.location.name,
  address: checkInItem.location.address,
  globalLocationNumber: checkInItem.location.globalLocationNumber,
  globalLocationNumberHash: checkInItem.location.globalLocationNumberHash,
  isFavourite: checkInItem.location.isFavourite,
  locationId: checkInItem.location.id,
});
