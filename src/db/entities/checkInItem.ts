import { hashLocationNumber } from "@db/hashLocationNumber";
import { createLogger } from "@logger/createLogger";
import { nanoid } from "@reduxjs/toolkit";
import _ from "lodash";
import moment from "moment";
import { Results, UpdateMode } from "realm";

import { createPrivate, createPublic } from "../create";
import { CheckInItemEntity, CheckInItemPublicEntity } from "./entities";
import {
  editLocation,
  Location,
  removeOldLocations,
  upsertLocation,
} from "./location";

export interface AddCheckInItem {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  name: string;
  address: string;
  globalLocationNumber: string;
  note?: string;
  type: CheckInItemType;
}

export interface CheckInItemV6 {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  name: string;
  address: string;
  globalLocationNumber: string;
  globalLocationNumberHash: string;
  note?: string;
  type: CheckInItemType;
}

export interface CheckInItem {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  note?: string;
  type: CheckInItemType;
  location: Location;
}

export interface CheckInItemPublic {
  id: string;
  startDate: Date;
  endDate?: Date;
  globalLocationNumberHash: string;
}

export enum CheckInItemType {
  Scan = 0,
  Manual = 1,
  NFC = 2,
}

const { logError } = createLogger("db/checkInItem.ts");

export const MaxPageSize = 30;

export const addCheckIn = async (item: AddCheckInItem) => {
  const location = await upsertLocation({
    globalLocationNumber: item.globalLocationNumber,
    name: item.name,
    address: item.address,
    lastVisited: item.startDate,
    type: item.type,
  });

  const privateDb = await createPrivate();
  const id = item.id ?? nanoid();

  privateDb.write(() => {
    const checkIn = privateDb.create<CheckInItem>(
      CheckInItemEntity,
      {
        ...item,
        location,
      },
      UpdateMode.Modified,
    );
    checkIn.location = location;
    if (
      checkIn.location.lastVisited == null ||
      checkIn.startDate > checkIn.location.lastVisited
    ) {
      checkIn.location.lastVisited = checkIn.startDate;
    }
  });
  privateDb.close();

  const publicDb = await createPublic();
  publicDb.write(() => {
    publicDb.create<CheckInItemPublic>(
      CheckInItemPublicEntity,
      {
        id,
        startDate: item.startDate,
        endDate: item.endDate,
        globalLocationNumberHash: hashLocationNumber(item.globalLocationNumber),
      },
      UpdateMode.Modified,
    );
  });
  publicDb.close();
  return id;
};

export const addCheckIns = async (items: AddCheckInItem[]) => {
  const locationMap = new Map<string, Location>();

  for (const item of items) {
    const location = await upsertLocation({
      globalLocationNumber: item.globalLocationNumber,
      name: item.name,
      address: item.address,
      lastVisited: item.startDate,
      type: item.type,
    });
    locationMap.set(location.globalLocationNumber, location);
  }

  const privateDb = await createPrivate();
  privateDb.write(() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const location = locationMap.get(item.globalLocationNumber)!;
      const checkIn = privateDb.create<CheckInItem>(
        CheckInItemEntity,
        {
          ...item,
          location,
        },
        UpdateMode.Modified,
      );
      checkIn.location = location;
    }
  });
  privateDb.close();

  const publicDb = await createPublic();
  publicDb.write(() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      publicDb.create<CheckInItemPublic>(
        CheckInItemPublicEntity,
        {
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,
          globalLocationNumberHash: hashLocationNumber(
            item.globalLocationNumber,
          ),
        },
        UpdateMode.Modified,
      );
    }
  });
  publicDb.close();
};

export const remove = async (id: string) => {
  const privateDb = await createPrivate();
  const checkInItem = privateDb.objectForPrimaryKey<CheckInItem>(
    CheckInItemEntity,
    id,
  );

  if (checkInItem == null) {
    throw new Error("CheckInItem doesn't exist");
  }

  const locationId = checkInItem.location.id;

  privateDb.write(() => {
    privateDb.delete(checkInItem);
  });
  privateDb.close();

  await updateLastVisited(locationId);

  const publicDb = await createPublic();
  const checkInItemPublic = publicDb.objectForPrimaryKey(
    CheckInItemPublicEntity,
    id,
  );

  if (checkInItemPublic == null) {
    logError(
      "Tried to remove checkInItemPublic but it does not exist in publicDb",
    );
    publicDb.close();
    return;
  }

  publicDb.write(() => {
    publicDb.delete(checkInItemPublic);
  });
  publicDb.close();
};

export const queryResults = (
  db: Realm,
  userId: string | string[] | undefined,
  before: Date,
): Results<Realm.Object & CheckInItem> => {
  let queryable = db.objects<Realm.Object & CheckInItem>(CheckInItemEntity);

  if (userId != null) {
    const userIds = _.isString(userId) ? [userId] : userId;
    const userIdFilter = userIds.map((x) => `userId = '${x}'`).join(" OR ");
    queryable = queryable.filtered(userIdFilter);
  }

  queryable = queryable
    .filtered("startDate < $0", before)
    .sorted("startDate", true);

  return queryable;
};

export const ALL = "ALL";

export const query = async (
  userId: string | string[] | undefined,
  before: Date,
  take: number | typeof ALL = 12,
): Promise<CheckInItem[]> => {
  if (_.isNumber(take) && take > MaxPageSize) {
    throw new Error(`Page size must be less than ${MaxPageSize}`);
  }
  const privateDb = await createPrivate();

  const queryable = queryResults(privateDb, userId, before);
  const results =
    take === ALL
      ? queryable.map((x) => x.toJSON())
      : queryable.slice(0, take).map((x) => x.toJSON());

  privateDb.close();

  return (Array.from(results) as unknown[]) as CheckInItem[];
};

export const count = async (userId?: string) => {
  const privateDb = await createPrivate();
  let queryable = privateDb.objects(CheckInItemEntity);
  if (userId != null) {
    queryable = queryable.filtered("userId = $0", userId);
  }
  const result = queryable.length;
  privateDb.close();
  return result;
};

const day = 60 * 60 * 24 * 1000;
export const countActiveDays = async (userId?: string) => {
  const privateDb = await createPrivate();
  let queryable = privateDb.objects(CheckInItemEntity);
  if (userId != null) {
    // To track 14 days, query from start of today - 13
    const minDateTime = new Date(moment().startOf("day").valueOf() - 13 * day);
    queryable = queryable.filtered(
      "userId = $0 && startDate >= $1",
      userId,
      minDateTime,
    );
  }

  const days = new Set<number>();
  for (const entry of queryable) {
    const startDate = moment((entry as any).startDate).startOf("day");
    days.add(startDate.valueOf());
  }
  privateDb.close();
  return days.size;
};

export const findCheckInItem = async (
  globalLocationNumberHash?: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const privateDb = await createPrivate();
  const result: CheckInItem | undefined = privateDb
    .objects(CheckInItemEntity)
    .filtered(
      "location.globalLocationNumberHash = $0",
      globalLocationNumberHash,
    )
    .filtered("startDate => $0 && startDate =< $1", startDate, endDate) // within event time range
    .sorted("startDate", true) // descending, lastest check in within time range
    .slice(0, 1)
    .map((x) => x.toJSON())[0];

  privateDb.close();

  return result;
};

export const findCheckInItemById = async (id: string): Promise<CheckInItem> => {
  const privateDb = await createPrivate();
  const result = privateDb
    .objectForPrimaryKey<CheckInItem>(CheckInItemEntity, id)
    ?.toJSON();
  privateDb.close();
  return result;
};

export const removeMany = async (maxDate: Date) => {
  const privateDb = await createPrivate();
  const checkIns = privateDb
    .objects<CheckInItem>(CheckInItemEntity)
    .filtered("startDate < $0", maxDate);
  const locationIds = checkIns.map((x) => x.location.id);
  privateDb.write(() => {
    privateDb.delete(checkIns);
  });
  privateDb.close();
  for (const locationId of locationIds) {
    await updateLastVisited(locationId);
  }
  const publicDb = await createPublic();
  const publicCheckIns = publicDb
    .objects(CheckInItemPublicEntity)
    .filtered("startDate < $0", maxDate);
  publicDb.write(() => {
    publicDb.delete(publicCheckIns);
  });
  publicDb.close();
};

export const findByLocationNumberHash = async (hash: string) => {
  const privateDb = await createPrivate();

  const checkIn: CheckInItem | undefined = privateDb
    .objects(CheckInItemEntity)
    .filtered("location.globalLocationNumberHash = $0", hash)
    .slice(0, 1)
    .map((x) => x.toJSON())[0];

  privateDb.close();

  return checkIn;
};

export interface EditCheckIn {
  id: string;
  details?: string;
  name?: string;
  startDate?: Date;
}

export const editCheckIn = async (request: EditCheckIn) => {
  const privateDb = await createPrivate();
  const checkIn = privateDb.objectForPrimaryKey<CheckInItem>(
    CheckInItemEntity,
    request.id,
  );

  if (checkIn == null) {
    return;
  }

  const locationId = checkIn.location.id;

  privateDb.write(() => {
    if (request.details != null) {
      checkIn.note = request.details;
    }
    if (request.name != null) {
      checkIn.location.name = request.name;
    }
    if (request.startDate != null) {
      checkIn.startDate = request.startDate;
    }
  });
  privateDb.close();

  if (request.startDate != null) {
    await updateLastVisited(locationId);
  }
};

export const countAll = async () => {
  const privateDb = await createPrivate();
  const result = privateDb.objects(CheckInItemEntity).length;
  privateDb.close();
  return result;
};

export const updateLastVisited = async (locationId: string) => {
  const db = await createPrivate();
  const lastVisited: CheckInItem[] = db
    .objects<CheckInItem>(CheckInItemEntity)
    .filtered("location.id = $0", locationId)
    .sorted("startDate", true)
    ?.toJSON();
  db.close();

  await editLocation(locationId, (location) => {
    location.lastVisited = lastVisited[0]?.startDate;
    location.hasDiaryEntry = lastVisited.length > 0;
  });

  await removeOldLocations();
};
