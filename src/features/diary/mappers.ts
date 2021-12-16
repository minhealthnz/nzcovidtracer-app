import { CheckInItemMatch } from "@db/entities/checkInItemMatch";
import { groupBy, isEmpty } from "lodash";

import {
  AddCheckInItem,
  CheckInItem,
  CheckInItemType,
} from "../../db/entities/checkInItem";
import { AddDiaryEntry } from "./reducer";
import { DiaryEntry, DiaryEntryType, ExportDiaryEntry } from "./types";

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
    case "link":
      return CheckInItemType.Link;
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
    case 3:
      return "link";
    default:
      return "scan";
  }
};

export const mapDiaryEntry = (
  checkInItem: CheckInItem,
  matches?: CheckInItemMatch[],
): DiaryEntry => ({
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
  isRisky:
    matches && !isEmpty(matches)
      ? checkExposureMatch(checkInItem, matches)
      : false,
});

export const mapExportDiaryEntry = (
  checkInItem: CheckInItem,
): ExportDiaryEntry => ({
  id: checkInItem.id,
  type: mapDiaryEntryType(checkInItem.type),
  startDate: checkInItem.startDate.getTime(),
  details: checkInItem.note,
  name: checkInItem.location.name,
  address: checkInItem.location.address,
  globalLocationNumber: checkInItem.location.globalLocationNumber,
  isFavourite: checkInItem.location.isFavourite,
});

export const mapAddDiaryEntry = (userId: string) => (
  diary: ExportDiaryEntry,
) => ({
  id: diary.id,
  userId: userId,
  startDate: new Date(diary.startDate),
  name: diary.name,
  address: diary.address,
  globalLocationNumber: diary.globalLocationNumber,
  details: diary.details,
  type: diary.type,
  isFavourite: diary.isFavourite,
});

const checkExposureMatch = (
  entry: CheckInItem,
  matches: CheckInItemMatch[],
) => {
  const locationHash = entry?.location?.globalLocationNumberHash;
  const groupedMatches = groupBy(
    matches,
    (match) => match.globalLocationNumberHash,
  );

  if (locationHash && groupedMatches[locationHash]) {
    for (const match of groupedMatches[locationHash]) {
      if (
        match.startDate.getTime() <= entry.startDate.getTime() &&
        match.endDate.getTime() >= entry.startDate.getTime()
      ) {
        return true;
      }
    }
  }

  return false;
};
