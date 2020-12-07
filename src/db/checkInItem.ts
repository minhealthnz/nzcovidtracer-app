import { createLogger } from "@logger/createLogger";
import { nanoid } from "@reduxjs/toolkit";
import _ from "lodash";
import { Results, UpdateMode } from "realm";

import { createPrivate, createPublic } from "./create";
import { CheckInItemEntity, CheckInItemPublicEntity } from "./entities";

export interface UpsertCheckInItem {
  id?: string;
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
  name: string;
  address: string;
  globalLocationNumber: string;
  globalLocationNumberHash: string;
  note?: string;
  type: CheckInItemType;
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
}

const { logError } = createLogger("db/checkInItem.ts");

export const MaxPageSize = 30;

export const upsert = async (item: UpsertCheckInItem) => {
  const privateDb = await createPrivate();
  const id = item.id ?? nanoid();
  privateDb.write(() => {
    privateDb.create<CheckInItem>(
      CheckInItemEntity,
      { ...item, id },
      UpdateMode.Modified,
    );
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
        globalLocationNumberHash: item.globalLocationNumberHash,
      },
      UpdateMode.Modified,
    );
  });
  publicDb.close();
  return id;
};

export const upsertMany = async (items: UpsertCheckInItem[]) => {
  const ids = items.map((item) => item.id ?? nanoid());
  const privateDb = await createPrivate();
  privateDb.write(() => {
    for (let i = 0; i < items.length; i++) {
      const id = ids[i];
      const item = items[i];
      privateDb.create<CheckInItem>(
        CheckInItemEntity,
        { ...item, id },
        UpdateMode.Modified,
      );
    }
  });
  privateDb.close();

  const publicDb = await createPublic();
  publicDb.write(() => {
    for (let i = 0; i < items.length; i++) {
      const id = ids[i];
      const item = items[i];
      publicDb.create<CheckInItemPublic>(
        CheckInItemPublicEntity,
        {
          id,
          startDate: item.startDate,
          endDate: item.endDate,
          globalLocationNumberHash: item.globalLocationNumberHash,
        },
        UpdateMode.Modified,
      );
    }
  });
  publicDb.close();
};

export const remove = async (id: string) => {
  const privateDb = await createPrivate();
  const checkInItem = privateDb.objectForPrimaryKey(CheckInItemEntity, id);

  privateDb.write(() => {
    privateDb.delete(checkInItem);
  });
  privateDb.close();

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

export const removeMany = async (maxDate: Date) => {
  const privateDb = await createPrivate();
  const checkIns = privateDb
    .objects(CheckInItemEntity)
    .filtered("startDate < $0", maxDate);
  privateDb.write(() => {
    privateDb.delete(checkIns);
  });
  privateDb.close();
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
    .filtered("globalLocationNumberHash = $0", hash)
    .slice(0, 1)
    .map((x) => x.toJSON())[0];

  privateDb.close();

  return checkIn;
};
