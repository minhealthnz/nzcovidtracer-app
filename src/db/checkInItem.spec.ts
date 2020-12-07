import { nanoid } from "@reduxjs/toolkit";

import {
  CheckInItem,
  CheckInItemPublic,
  CheckInItemType,
  count,
  query,
  remove,
  removeMany,
  upsert,
  UpsertCheckInItem,
} from "./checkInItem";
import { createPrivate, createPublic } from "./create";
import { CheckInItemEntity, CheckInItemPublicEntity } from "./entities";

it("should insert", async () => {
  const entry = buildUpsert();
  await upsert(entry);
  const result = (await query(entry.userId, new Date()))[0];
  verify(result, entry);
});

it("upsert twice shouldn't fail", async () => {
  const entry = buildUpsert();
  await upsert(entry);
  await upsert(entry);
  const result = (await query(entry.userId, new Date()))[0];
  verify(result, entry);
});

it("should insert to public db", async () => {
  const entry = buildUpsert();
  const id = await upsert(entry);
  const publicDb = await createPublic();
  const result = publicDb.objectForPrimaryKey<CheckInItemPublic>(
    CheckInItemPublicEntity,
    id,
  )!;
  expect(result).toBeTruthy();
  expect(result.id).toEqual(id);
  expect(result.startDate).toEqual(entry.startDate);
  expect(result.endDate).toEqual(entry.endDate);
  expect(result.globalLocationNumberHash).toEqual(
    entry.globalLocationNumberHash,
  );
});

it("should update", async () => {
  const id = nanoid();
  const userId = nanoid();

  await upsert(buildUpsert(userId, id));
  const update = buildUpsert(userId, id);
  await upsert(update);

  expect(await count(userId)).toEqual(1);
  const updated = (await query(userId, new Date()))[0];
  verify(updated, update);
});

it("should remove", async () => {
  const id = nanoid();
  const userId = nanoid();

  await upsert(buildUpsert(userId, id));
  expect(await count(userId)).toEqual(1);

  await remove(id);
  expect(await count(userId)).toEqual(0);
});

it("should remove from public db", async () => {
  const id = nanoid();
  const userId = nanoid();

  await upsert(buildUpsert(userId, id));
  expect(await count(userId)).toEqual(1);

  await remove(id);
  expect(await count(userId)).toEqual(0);

  const publicDb = await createPublic();
  const result = publicDb.objectForPrimaryKey(CheckInItemPublicEntity, id);
  expect(result).toBeUndefined();
});

it("should query sorted by startDate desc", async () => {
  const num = 10;

  const userId = nanoid();
  for (let i = 0; i < num; i++) {
    const item = buildUpsert(userId);
    await upsert(item);
  }

  const results = await query(userId, new Date(), num);

  expect(results.length).toEqual(num);

  for (let i = 0; i < results.length - 1; i++) {
    const first = results[i];
    const second = results[i + 1];

    expect(first.startDate.getTime()).toBeGreaterThan(
      second.startDate.getTime(),
    );
  }
});

it("should query paginated", async () => {
  const pageSize = 5;
  const userId = nanoid();
  const expectIds = await buildCheckIns(10, userId);
  const firstPage = await query(userId, new Date(), pageSize);
  // Query from min date
  const pointer = firstPage[firstPage.length - 1].startDate;
  const secondPage = await query(userId, pointer, pageSize);

  const ids = new Set([
    ...firstPage.map((x) => x.id),
    ...secondPage.map((x) => x.id),
  ]);

  expect(ids).toEqual(expectIds);
});

it("should remove many", async () => {
  const userId = nanoid();
  const ids = await buildCheckIns(10, userId);
  await removeMany(new Date());

  const privateDb = await createPrivate();
  const publicDb = await createPublic();
  for (const id of ids) {
    const item = privateDb.objectForPrimaryKey(CheckInItemEntity, id);
    expect(item).toEqual(undefined);
    const publicItem = publicDb.objectForPrimaryKey(
      CheckInItemPublicEntity,
      id,
    );
    expect(publicItem).toEqual(undefined);
  }
  privateDb.close();
  publicDb.close();
});

async function buildCheckIns(
  num: number,
  userId: string,
): Promise<Set<string>> {
  const ids = new Set<string>();

  for (let i = 0; i < num; i++) {
    const id = nanoid();
    const item = buildUpsert(userId, id);
    await upsert(item);
    ids.add(id);
  }

  return ids;
}

let seed = 1;

// Seeded random between 0 and 1
function random() {
  return (((Math.sin(seed++) * 100000) % 1) + 1) / 2;
}

const buildUpsert = (userId?: string, id?: string) => {
  id = id ?? nanoid();
  userId = userId ?? nanoid();
  const startDate = new Date(random() * 100000);

  const entry: UpsertCheckInItem = {
    id,
    userId,
    startDate,
    endDate: new Date(),
    name: nanoid(),
    address: nanoid(),
    globalLocationNumber: nanoid(),
    globalLocationNumberHash: nanoid(),
    type: random() > 0.5 ? CheckInItemType.Scan : CheckInItemType.Manual,
    note: "foo",
  };

  return entry;
};

const verify = (checkInItem: CheckInItem, entry: UpsertCheckInItem) => {
  expect(checkInItem.id).toEqual(entry.id);
  expect(checkInItem.userId).toEqual(entry.userId);
  expect(checkInItem.startDate).toEqual(entry.startDate);
  expect(checkInItem.endDate).toEqual(entry.endDate);
  expect(checkInItem.name).toEqual(entry.name);
  expect(checkInItem.address).toEqual(entry.address);
  expect(checkInItem.globalLocationNumber).toEqual(entry.globalLocationNumber);
  expect(checkInItem.globalLocationNumberHash).toEqual(
    entry.globalLocationNumberHash,
  );
  expect(checkInItem.note).toEqual(entry.note);
  expect(checkInItem.type).toEqual(entry.type);
};
