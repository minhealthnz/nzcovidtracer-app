import { hashLocationNumber } from "@db/hashLocationNumber";
import { nanoid } from "@reduxjs/toolkit";

import { createPrivate, createPublic } from "../create";
import {
  addCheckIn,
  AddCheckInItem,
  addCheckIns,
  CheckInItem,
  CheckInItemPublic,
  CheckInItemType,
  count,
  countAll,
  EditCheckIn,
  editCheckIn,
  findCheckInItemById,
  query,
  remove,
  removeMany,
} from "./checkInItem";
import { CheckInItemEntity, CheckInItemPublicEntity } from "./entities";
import { getLocationById } from "./location";

describe("#addCheckIn", () => {
  it("should insert", async () => {
    const entry = buildAddCheckIn();
    await addCheckIn(entry);
    const result = (await query(entry.userId, new Date()))[0];
    verify(result, entry);
  });

  it("should insert to public db", async () => {
    const entry = buildAddCheckIn();
    const id = await addCheckIn(entry);
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
      hashLocationNumber(entry.globalLocationNumber),
    );
  });

  it("should update lastVisited", async () => {
    const entry = buildAddCheckIn();
    const checkInId = await addCheckIn(entry);
    const checkIn = await findCheckInItemById(checkInId);
    expect(checkIn.location.lastVisited).toEqual(checkIn.startDate);
  });
});

describe("#removeCheckIn", () => {
  it("should remove", async () => {
    const id = nanoid();
    const userId = nanoid();

    await addCheckIn(buildAddCheckIn({ userId, id }));
    expect(await count(userId)).toEqual(1);

    await remove(id);
    expect(await count(userId)).toEqual(0);
  });

  it("should remove from public db", async () => {
    const id = nanoid();
    const userId = nanoid();

    await addCheckIn(buildAddCheckIn({ userId, id }));
    expect(await count(userId)).toEqual(1);

    await remove(id);
    expect(await count(userId)).toEqual(0);

    const publicDb = await createPublic();
    const result = publicDb.objectForPrimaryKey(CheckInItemPublicEntity, id);
    expect(result).toBeUndefined();
  });

  it("shoud update last visited", async () => {
    const request = buildAddCheckIn();
    const olderDate = new Date("May 5 2000");
    const requestOlder: AddCheckInItem = {
      ...request,
      startDate: olderDate,
      note: "older",
      id: nanoid(),
    };
    const idOlder = await addCheckIn(requestOlder);
    (await findCheckInItemById(idOlder)).location.id;
    const id = await addCheckIn(request);
    const locationId = (await findCheckInItemById(id)).location.id;
    await remove(id);
    const location = await getLocationById(locationId);
    expect(location?.lastVisited).toEqual(olderDate);
  });

  it("shoud remove location if no entries left", async () => {
    const request = buildAddCheckIn();
    const id = await addCheckIn(request);
    const locationId = (await findCheckInItemById(id)).location.id;
    await remove(id);
    const location = await getLocationById(locationId);
    expect(location).toEqual(undefined);
  });
});

it("should query sorted by startDate desc", async () => {
  const num = 10;

  const userId = nanoid();
  for (let i = 0; i < num; i++) {
    const item = buildAddCheckIn({ userId });
    await addCheckIn(item);
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

describe("#removeMany", () => {
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

  it("should remove location if no entries left", async () => {
    const userId = nanoid();
    const ids = await buildCheckIns(10, userId);
    const locationIds = [];
    for (const id of ids) {
      const checkIn = await findCheckInItemById(id);
      const locationId = checkIn.location.id;
      locationIds.push(locationId);
    }
    await removeMany(new Date());
    for (const locationId of locationIds) {
      const location = await getLocationById(locationId);
      expect(location).toBe(undefined);
    }
  });
});

it("finds check in by id", async () => {
  const userId = nanoid();
  const id = nanoid();
  const request = buildAddCheckIn({ userId, id });
  await addCheckIn(request);
  const found = await findCheckInItemById(id);
  verify(found, request);
});

describe("editCheckIn", () => {
  it("edits check in", async () => {
    const userId = nanoid();
    const id = nanoid();
    const upsertRequest = buildAddCheckIn({ userId, id });
    await addCheckIn(upsertRequest);

    const request: EditCheckIn = {
      id,
      details: nanoid(),
      name: nanoid(),
      startDate: new Date(Math.random()),
    };

    await editCheckIn(request);

    const checkIn = await findCheckInItemById(id);

    expect(checkIn.note).toEqual(request.details);
    expect(checkIn.location.name).toEqual(request.name);
    expect(checkIn.startDate).toEqual(request.startDate);
  });

  it("updates lastVisited", async () => {
    const request = buildAddCheckIn();
    const checkInId = await addCheckIn(request);
    const startDate = new Date(Math.random());
    await editCheckIn({
      id: checkInId,
      startDate,
    });

    const checkIn = await findCheckInItemById(checkInId);
    expect(checkIn.startDate).toEqual(startDate);
  });
});

describe("#addCheckIns", () => {
  it("adds many checkins", async () => {
    const size = 10;
    const items = buildUpserts(size);
    await addCheckIns(items);
    for (let i = 0; i < size; i++) {
      const request = items[i];
      const checkIn = await findCheckInItemById(request.id);
      verify(checkIn, request);
    }
  });
  it("adds many checkins with the same location", async () => {
    const size = 10;
    const items = buildUpserts(size);
    const gln = nanoid();
    const name = nanoid();
    const address = nanoid();
    const type = 1;
    for (const item of items) {
      item.globalLocationNumber = gln;
      item.name = name;
      item.address = address;
      item.type = type;
    }
    await addCheckIns(items);
    for (const item of items) {
      const checkIn = await findCheckInItemById(item.id);
      verify(checkIn, item);
    }
  });
  it("repeating the same requests gives the same results", async () => {
    const prev = await countAll();
    const size = 10;
    const items = buildUpserts(size);
    await addCheckIns(items);
    await addCheckIns(items);
    for (const item of items) {
      const checkIn = await findCheckInItemById(item.id);
      verify(checkIn, item);
    }
    const after = await countAll();
    // Verify only 10 items added
    expect(after - prev).toEqual(size);
  });
  it("should update last visited", async () => {
    const size = 10;
    const items = buildUpserts(size);
    await addCheckIns(items);
    for (const item of items) {
      const checkIn = await findCheckInItemById(item.id);
      expect(checkIn.location.lastVisited).toEqual(checkIn.startDate);
    }
  });
});

async function buildCheckIns(
  num: number,
  userId: string,
): Promise<Set<string>> {
  const ids = new Set<string>();

  for (let i = 0; i < num; i++) {
    const id = nanoid();
    const item = buildAddCheckIn({ userId, id });
    await addCheckIn(item);
    ids.add(id);
  }

  return ids;
}

let seed = 1;

// Seeded random between 0 and 1
function random() {
  return (((Math.sin(seed++) * 100000) % 1) + 1) / 2;
}

const buildUpserts = (num: number) => {
  const results = [];
  for (let i = 0; i < num; i++) {
    results.push(buildAddCheckIn());
  }
  return results;
};

const buildAddCheckIn = (partial?: Partial<AddCheckInItem>) => {
  const startDate = new Date(random() * 100000);

  const entry: AddCheckInItem = {
    id: nanoid(),
    userId: nanoid(),
    startDate,
    endDate: new Date(),
    name: nanoid(),
    address: nanoid(),
    globalLocationNumber: nanoid(),
    type: random() > 0.5 ? CheckInItemType.Scan : CheckInItemType.Manual,
    note: "foo",
    ...partial,
  };

  return entry;
};

const verify = (checkInItem: CheckInItem, entry: AddCheckInItem) => {
  expect(checkInItem.id).toEqual(entry.id);
  expect(checkInItem.userId).toEqual(entry.userId);
  expect(checkInItem.startDate).toEqual(entry.startDate);
  expect(checkInItem.endDate).toEqual(entry.endDate);
  expect(checkInItem.location.name).toEqual(entry.name);
  expect(checkInItem.location.address).toEqual(entry.address);
  expect(checkInItem.location.globalLocationNumber).toEqual(
    entry.globalLocationNumber,
  );
  expect(checkInItem.location.globalLocationNumberHash).toEqual(
    hashLocationNumber(checkInItem.location.globalLocationNumber),
  );
  expect(checkInItem.note).toEqual(entry.note);
  expect(checkInItem.type).toEqual(entry.type);
};
