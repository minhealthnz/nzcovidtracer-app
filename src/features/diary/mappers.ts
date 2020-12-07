import { CheckInItem, CheckInItemType } from "../../db/checkInItem";
import { DiaryEntry, DiaryEntryType } from "./types";

export const mapCheckInItem = (entry: DiaryEntry): CheckInItem => ({
  ...entry,
  userId: entry.userId,
  startDate: new Date(entry.startDate),
  endDate: entry.endDate == null ? undefined : new Date(entry.endDate),
  address: entry.address ?? "",
  globalLocationNumber: entry.globalLocationNumber ?? "",
  globalLocationNumberHash: entry.globalLocationNumberHash ?? "",
  type: mapCheckInType(entry.type),
  note: entry.details,
});

export const mapCheckInType = (type: DiaryEntryType) => {
  switch (type) {
    case "scan":
      return CheckInItemType.Scan;
    case "manual":
      return CheckInItemType.Manual;
  }
};

export const mapDiaryEntryType = (type: CheckInItemType): DiaryEntryType => {
  switch (type) {
    case 0:
      return "scan";
    case 1:
      return "manual";
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
});
