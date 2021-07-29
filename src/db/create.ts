import { createLogger } from "@logger/createLogger";
import { Platform } from "react-native";
import Realm from "realm";

import config from "../config";
import {
  CheckInItemMatchSchema,
  CheckInItemPublicSchema,
  CheckInItemSchema,
  LocationSchema,
  UserSchema,
} from "./entities/schemas";
import getPrivateDbKey from "./getPrivateDbKey";
import getPublicDbKey from "./getPublicDbKey";
import { get as getKeystore, set as setKeystore } from "./keystore";
import { migratePrivate, migratePublic } from "./migrate";
import { randomBytes } from "./randomBytes";

const { logError } = createLogger("db/create");

async function getPassword(service: string) {
  try {
    return await getKeystore(service);
  } catch (err) {
    logError(err);
  }
}

async function setPassword(service: string, password: string) {
  try {
    await setKeystore(service, password);
  } catch (err) {
    logError(err);
  }
}

export const createPrivate = async () => {
  const key = await getPrivateDbKey({
    shouldGenerate: config.GeneratePrivateDbEncryptionKey,
    defaultKey: config.DbEncryptionKey,
    service: config.PrivateDbEncryptionKeyService,
    getPassword,
    setPassword,
    randomBytes,
  });

  // TODO if decryption fails and key is lost, recreate the db
  return await Realm.open({
    // iOS realm is created under a folder to simplify applying file protection levels
    path: Platform.OS === "ios" ? "private/db.realm" : "private.realm",
    schema: [CheckInItemSchema, UserSchema, LocationSchema],
    schemaVersion: 8,
    encryptionKey: key,
    migration: migratePrivate,
  });
};

export const createPublic = async () => {
  // TODO fix swift code
  const key = await getPublicDbKey();

  // TODO if decryption fails and key is lost, recreate the db
  return await Realm.open({
    // iOS realm is created under a folder to simplify applying file protection levels
    path: Platform.OS === "ios" ? "public/db.realm" : "public.realm",
    schema: [CheckInItemPublicSchema, CheckInItemMatchSchema],
    schemaVersion: 8,
    encryptionKey: key,
    migration: migratePublic,
  });
};
