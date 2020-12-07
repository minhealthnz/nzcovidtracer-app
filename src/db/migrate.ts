import { nanoid } from "@reduxjs/toolkit";
import Realm, { UpdateMode } from "realm";

import {
  CheckInItemEntity,
  CheckInItemPublicEntity,
  UserEntity,
} from "./entities";
import { hashLocationNumber } from "./hash";
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
