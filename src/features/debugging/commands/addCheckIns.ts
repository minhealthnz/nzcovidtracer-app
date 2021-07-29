import {
  AddCheckInItem,
  addCheckIns as dbAddCheckIns,
  CheckInItemType,
} from "@db/entities/checkInItem";
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
  await dbAddCheckIns(items);
};

const buildUpsert = (userId: string) => {
  const id = nanoid();

  if (userId == null) {
    throw new Error("No user id found!");
  }

  // 0 - 120 days
  const span = Math.random() * 60 * 60 * 24 * 120 * 1000;

  const type =
    Math.random() > 0.5 ? CheckInItemType.Scan : CheckInItemType.Manual;
  const locationNumber =
    type === CheckInItemType.Manual ? "" : buildLocationNumber();

  const entry: AddCheckInItem = {
    id,
    userId,
    startDate: new Date(new Date().getTime() - span),
    name: nanoid(),
    address: nanoid(),
    globalLocationNumber: locationNumber,
    type,
    note: nanoid(),
  };

  return entry;
};

const buildLocationNumber = () => {
  let locationNumber = "";
  const locationNumberLength = 13;
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < locationNumberLength; i++) {
    locationNumber += digits[Math.floor(Math.random() * digits.length)];
  }
  return locationNumber;
};
