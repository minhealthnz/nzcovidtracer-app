import { nanoid } from "@reduxjs/toolkit";
import Realm, { Results, UpdateMode } from "realm";

import { CheckInItem, CheckInItemV6 } from "./entities/checkInItem";
import {
  CheckInItemEntity,
  CheckInItemPublicEntity,
  LocationEntity,
  UserEntity,
} from "./entities/entities";
import { Location, LocationType } from "./entities/location";
import { getLocationType } from "./getLocationType";
import { hashLocationNumber } from "./hashLocationNumber";
import { hexToBase64 } from "./hex";

export const migratePrivate = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 1) {
    const oldEntities = oldRealm.objects(CheckInItemEntity);
    const newEntities = newRealm.objects(CheckInItemEntity);

    for (let i = 0; i < oldEntities.length; i++) {
      const newEntity = newEntities[i] as any;
      const oldEntity = oldEntities[i] as any;
      newEntity.startDate = oldEntity.date;
      if (oldEntity.globalLocationNumber != null) {
        newEntity.globalLocationNumberHash = hashLocationNumber(
          oldEntity.globalLocationNumber,
        );
      }
    }
  }

  if (oldRealm.schemaVersion < 4) {
    const userIds = new Set<string>();
    oldRealm.objects(CheckInItemEntity).forEach((checkIn: any) => {
      if (checkIn.userId) {
        userIds.add(checkIn.userId);
      }
    });

    for (const userId of userIds) {
      newRealm.create(UserEntity, { id: userId }, UpdateMode.Modified);
    }
  }

  if (oldRealm.schemaVersion < 5) {
    newRealm.objects(UserEntity).forEach((user: any) => {
      if (user.id == null) {
        user.id = nanoid();
      }
    });
  }

  if (oldRealm.schemaVersion < 7) {
    const locationsById = new Map<string, Location>();
    const checkInLocationIds = new Map<string, string>();
    // Sort by start date so only the latest location details are saved
    const oldDbSortedByStartDate = oldRealm
      .objects(CheckInItemEntity)
      .sorted("startDate", true);

    mapLocationFromOldRealm(
      oldDbSortedByStartDate,
      locationsById,
      checkInLocationIds,
    );

    for (const location of locationsById.values()) {
      newRealm.create<Location>(LocationEntity, location, UpdateMode.Never);
    }

    newRealm.objects(CheckInItemEntity).forEach((entry: any) => {
      const checkIn = entry as CheckInItem;
      const locationId = checkInLocationIds.get(checkIn.id);
      if (locationId == null) {
        throw new Error("Unexpected empty location id!");
      }
      const location = locationsById.get(locationId);
      if (location == null) {
        throw new Error("Cannot find location");
      }
      checkIn.location = location;
    });
  }

  if (oldRealm.schemaVersion < 8) {
    newRealm.objects(LocationEntity).forEach((location: any) => {
      if (location.hasDiaryEntry === undefined) {
        location.hasDiaryEntry = true;
      }
    });
  }
};

export const migratePublic = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 1) {
    const oldEntities = oldRealm.objects(CheckInItemPublicEntity);
    const newEntities = newRealm.objects(CheckInItemPublicEntity);

    for (let i = 0; i < oldEntities.length; i++) {
      const newEntity = newEntities[i] as any;
      const oldEntity = oldEntities[i] as any;
      newEntity.startDate = oldEntity.date;
      newEntity.globalLocationNumberHash = hexToBase64(
        oldEntity.globalLocationNumberHash,
      );
    }
  }
};

export const mapLocationFromOldRealm = (
  oldRealm: Results<Realm.Object>,
  locationsById: Map<string, Location>,
  checkInLocationIds: Map<string, string>,
) => {
  oldRealm.forEach((entry: any) => {
    const checkIn = entry as CheckInItemV6;
    const {
      name,
      address,
      globalLocationNumber,
      globalLocationNumberHash,
      type,
      startDate,
    } = checkIn;

    const id = globalLocationNumber || nanoid();

    const location: Location = {
      id,
      name,
      address,
      globalLocationNumber,
      globalLocationNumberHash,
      isFavourite: false,
      hasDiaryEntry: true,
      lastVisited: new Date(startDate),
      type: getLocationType(type),
    };
    // Find a location that already exists
    const matchingExistingLocation = Array.from(locationsById.values()).find(
      (e) =>
        // If they have the same id, then they both have the same GLN and are therefore the same location
        e.id === location.id ||
        // Or, if they’re both manual and have the same name, they are the same location
        (e.name === location.name &&
          location.type === LocationType.Manual &&
          e.type === LocationType.Manual),
    );
    if (matchingExistingLocation) {
      // Add new check in for the existing location
      checkInLocationIds.set(checkIn.id, matchingExistingLocation.id);
    } else {
      // Create new location and new check in for that location
      locationsById.set(id, location);
      checkInLocationIds.set(checkIn.id, location.id);
    }
  });
};
