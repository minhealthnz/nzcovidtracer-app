import { createPrivate } from "@db/create";
import { nanoid } from "@reduxjs/toolkit";

import { CheckInItemType } from "./checkInItem";
import {
  getLocationById,
  LocationType,
  queryLocations,
  removeOldLocations,
  setFavourite,
  UpsertLocation,
  upsertLocation,
} from "./location";

describe("#upsertLocation", () => {
  it.each([
    [CheckInItemType.Manual, LocationType.Manual],
    [CheckInItemType.NFC, LocationType.Scan],
    [CheckInItemType.NFC, LocationType.Scan],
  ])(
    "records correct type based on globalLocationNumber",
    async (checkInItemType, locationType) => {
      const globalLocationNumber = nanoid();
      const location = await upsertLocation({
        globalLocationNumber,
        name: nanoid(),
        address: nanoid(),
        type: checkInItemType,
      });
      expect(location.type).toEqual(locationType);
    },
  );
});

describe("#upsertLocation2", () => {
  it("creates location", async () => {
    const globalLocationNumber = nanoid();
    const name = nanoid();
    const address = nanoid();
    const location = await upsertLocation({
      globalLocationNumber,
      name,
      address,
      type: 0,
    });
    expect(location.globalLocationNumber).toEqual(globalLocationNumber);
    expect(location.name).toEqual(name);
    expect(location.address).toEqual(address);
  });

  it.each([
    [new Date(1), new Date(2), new Date(2)],
    [new Date(2), new Date(1), new Date(2)],
    [undefined, new Date(1), new Date(1)],
  ])("updates last visited if later", async (initial, updated, final) => {
    const globalLocationNumber = nanoid();
    const name = nanoid();
    const address = nanoid();
    await upsertLocation({
      globalLocationNumber,
      name,
      address,
      lastVisited: initial,
      type: 0,
    });

    const locationId = (
      await upsertLocation({
        globalLocationNumber,
        name,
        address,
        lastVisited: updated,
        type: 0,
      })
    ).id;

    const location = await getLocationById(locationId);
    expect(location?.lastVisited).toEqual(final);
  });
});

describe("#setFavourite", () => {
  it("adds favourite", async () => {
    const location = await upsertLocation({
      globalLocationNumber: nanoid(),
      name: nanoid(),
      address: nanoid(),
      type: 0,
    });
    await setFavourite(location.id, true);
    const updated = await getLocationById(location.id);
    expect(updated!.isFavourite).toBe(true);
  });
  it("removes favourite", async () => {
    const location = await upsertLocation({
      globalLocationNumber: nanoid(),
      name: nanoid(),
      address: nanoid(),
      type: 0,
    });
    await setFavourite(location.id, true);
    await setFavourite(location.id, false);
    const updated = await getLocationById(location.id);
    expect(updated!.isFavourite).toBe(false);
  });
});

describe("queryLocations", () => {
  it.each([
    ["abcd", "1234", "abcd", 0, true],
    ["abcd", "1234", "1234", 0, true],
    ["abcd", "1234", "abc", 0, true],
    ["abcd", "1234", "123", 0, true],
    ["abcd", "1234", "xxx", 0, false],
    ["abcd", "1234", "", 0, true],
    ["abcd", "1234", undefined, 1, true],
  ])(
    "text search filters by name and address",
    async (name, address, textSearch, type, match) => {
      const db = await createPrivate();
      const globalLocationNumber = nanoid();
      await upsertLocation({
        globalLocationNumber,
        name,
        address,
        type,
      });
      const results = queryLocations(db, {
        sortBy: "name",
        textSearch,
      });
      if (match) {
        expect(
          results.filtered("globalLocationNumber = $0", globalLocationNumber),
        ).toHaveLength(1);
      } else {
        expect(results).toHaveLength(0);
      }
      db.close();
    },
  );
});

describe("#removeOldLocations", () => {
  it("remove old locations", async () => {
    const fromDate = new Date(Math.random() * 1000000);
    const expired = new Date(fromDate.getTime() - 1000);
    const notExpired = new Date(fromDate.getTime() + 1000);

    const favourite = await buildLocation({
      isFavourite: true,
      lastVisited: notExpired,
    });

    const favouriteExpired = await buildLocation({
      isFavourite: true,
      lastVisited: expired,
    });

    const favouriteNotVisited = await buildLocation({
      isFavourite: true,
    });

    const currentLocation = await buildLocation({
      lastVisited: notExpired,
    });

    const expiredLocation = await buildLocation({
      lastVisited: expired,
    });

    const notVisited = await buildLocation({
      lastVisited: undefined,
    });

    await removeOldLocations();

    expect(await getLocationById(favourite.id)).toBeTruthy();
    expect(await getLocationById(favouriteExpired.id)).toBeTruthy();
    expect(await getLocationById(favouriteNotVisited.id)).toBeTruthy();
    expect(await getLocationById(currentLocation.id)).toBeTruthy();
    expect(await getLocationById(expiredLocation.id)).toBeTruthy();
    expect(await getLocationById(notVisited.id)).toBe(undefined);
  });
});

const buildLocation = async (partial: Partial<UpsertLocation>) => {
  return await upsertLocation({
    globalLocationNumber: nanoid(),
    name: nanoid(),
    address: nanoid(),
    type: 0,
    ...partial,
  });
};
