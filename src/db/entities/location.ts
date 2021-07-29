import { createPrivate } from "@db/create";
import { getLocationType } from "@db/getLocationType";
import { hashLocationNumber } from "@db/hashLocationNumber";
import { nanoid } from "@reduxjs/toolkit";
import { UpdateMode } from "realm";

import { CheckInItemType } from "./checkInItem";
import { LocationEntity } from "./entities";

export enum LocationType {
  Scan = 0,
  Manual = 1,
}

export interface Location {
  id: string;
  name: string;
  address: string;
  globalLocationNumber: string;
  globalLocationNumberHash: string;
  isFavourite: boolean;
  hasDiaryEntry: boolean;
  lastVisited?: Date;
  type: LocationType;
}

export interface UpsertLocation {
  globalLocationNumber: string;
  name: string;
  address: string;
  lastVisited?: Date;
  isFavourite?: boolean;
  type: CheckInItemType;
}

export const upsertLocation = async (
  request: UpsertLocation,
): Promise<Location> => {
  const db = await createPrivate();
  const id = request.globalLocationNumber || nanoid();
  const type = getLocationType(request.type);
  const existing =
    !!request.globalLocationNumber && type === LocationType.Scan
      ? db.objectForPrimaryKey<Location>(LocationEntity, id)
      : db
          .objects<Location>(LocationEntity)
          .filtered("name == $0 && type == $1", request.name, type)[0];
  let created: (Location & Realm.Object) | undefined;

  db.write(() => {
    if (existing == null) {
      created = db.create<Location>(
        LocationEntity,
        {
          id,
          name: request.name,
          address: request.address,
          globalLocationNumber: request.globalLocationNumber,
          globalLocationNumberHash: hashLocationNumber(
            request.globalLocationNumber,
          ),
          lastVisited: request.lastVisited,
          isFavourite: request.isFavourite ?? false,
          hasDiaryEntry: true,
          type,
        },
        UpdateMode.Never,
      );
    } else {
      existing.name = request.name;
      existing.address = request.address;
      existing.hasDiaryEntry = true;
      if (
        request.lastVisited != null &&
        (existing.lastVisited == null ||
          existing.lastVisited < request.lastVisited)
      ) {
        existing.lastVisited = request.lastVisited;
      }
    }
  });

  const result = (existing ?? created)!.toJSON();

  db.close();

  return result;
};

export const setFavourite = async (
  locationId: string,
  isFavourite: boolean,
) => {
  const db = await createPrivate();
  const location = db.objectForPrimaryKey<Location>(LocationEntity, locationId);
  if (location == null) {
    throw new Error("Location not found");
  }

  db.write(() => {
    if (!isFavourite && !location.hasDiaryEntry) {
      db.delete(location);
      return;
    }
    location.isFavourite = isFavourite;
  });

  db.close();
};

export const getLocationById = async (
  locationId: string,
): Promise<Location | undefined> => {
  const db = await createPrivate();
  const location = db
    .objectForPrimaryKey<Location>(LocationEntity, locationId)
    ?.toJSON();
  db.close();
  return location;
};

interface QueryLocations {
  isFavourite?: boolean;
  textSearch?: string;
  sortBy?: "name" | "lastVisited";
  id?: string;
  hasDiaryEntry?: boolean;
}

export const queryLocations = (
  db: Realm,
  { isFavourite, textSearch, sortBy, id, hasDiaryEntry }: QueryLocations,
) => {
  let results = db.objects<Location>(LocationEntity);
  if (isFavourite != null) {
    results = results.filtered("isFavourite = $0", isFavourite);
  }
  if (textSearch) {
    results = results.filtered(
      "name CONTAINS[c] $0 OR address CONTAINS[c] $1",
      textSearch,
      textSearch,
    );
  }
  if (hasDiaryEntry) {
    results = results.filtered("hasDiaryEntry = $0", hasDiaryEntry);
  }
  if (id) {
    results = results.filtered("id = $0", id);
  }
  switch (sortBy) {
    case "name":
      results = results.sorted("name");
      break;
    case "lastVisited":
      results = results.sorted("lastVisited", true);
      break;
  }
  return results;
};

interface EditLocation {
  lastVisited?: Date;
  hasDiaryEntry: boolean;
}

export const editLocation = async (
  id: string,
  editBlock: (location: EditLocation) => void,
) => {
  const db = await createPrivate();
  const location = db.objectForPrimaryKey<Location>(LocationEntity, id);
  if (location == null) {
    throw new Error("Location not found");
  }
  db.write(() => {
    editBlock(location);
  });
  db.close();
};

export const removeOldLocations = async () => {
  const db = await createPrivate();
  const locations = db
    .objects<Location>(LocationEntity)
    .filtered("lastVisited = $0", undefined)
    .filtered("isFavourite = $0", false);

  db.write(() => {
    for (const location of locations) {
      db.delete(location);
    }
  });

  db.close();
};

export const getHasFavourites = async () => {
  const db = await createPrivate();
  const result = db.objects(LocationEntity).filtered("isFavourite = $0", true)
    .length;
  db.close();
  return result > 0;
};

export const getHasDiaryEntries = async () => {
  const db = await createPrivate();
  const result = db.objects(LocationEntity).filtered("hasDiaryEntry = $0", true)
    .length;
  db.close();
  return result > 0;
};
