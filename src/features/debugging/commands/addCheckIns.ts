import {
  CheckInItemType,
  UpsertCheckInItem,
  upsertMany,
} from "@db/checkInItem";
import { hashLocationNumber } from "@db/hash";
import { _storeRef } from "@lib/storeRefs";
import { nanoid } from "@reduxjs/toolkit";

import { TestCommand } from "../testCommand";

export function buildAddCheckIns(num: number): TestCommand {
  return {
    command: "addTestEntries",
    async run() {
      const store = _storeRef.current;
      if (store == null) {
        throw new Error("Cannot find store");
      }
      const userId = store.getState().user.anonymousUserId;
      await createCheckIns(userId, num);
    },
    title: `Add ${num} visit entries`,
    description: "Entries will be randomly generated",
  };
}

export const addCheckIns = buildAddCheckIns(1000);

export const createCheckIns = async (userId: string, num: number) => {
  const items = [];
  for (let i = 0; i < num; i++) {
    items.push(buildUpsert(userId));
  }
  await upsertMany(items);
};

const buildUpsert = (userId: string) => {
  const id = nanoid();

  if (userId == null) {
    throw new Error("No user id found!");
  }

  // 0 - 120 days
  const span = Math.random() * 60 * 60 * 24 * 120 * 1000;

  let locationNumber = "";
  const locationNumberLength = 13;
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < locationNumberLength; i++) {
    locationNumber += digits[Math.floor(Math.random() * digits.length)];
  }

  const entry: UpsertCheckInItem = {
    id,
    userId,
    startDate: new Date(new Date().getTime() - span),
    name: nanoid(),
    address: nanoid(),
    globalLocationNumber: locationNumber,
    globalLocationNumberHash: hashLocationNumber(locationNumber),
    type: Math.random() > 0.5 ? CheckInItemType.Scan : CheckInItemType.Manual,
  };

  return entry;
};
