import { createLogger } from "@logger/createLogger";
import { maskToken } from "@utils/mask";
import { toByteArray } from "base64-js";

import config from "../config";
import covidTracerMigration from "./covidTracerMigration";

// Key never changes
let key: Uint8Array | undefined;

const { logInfo } = createLogger("getPublicDbKey.ios");

export default async (): Promise<Uint8Array> => {
  if (key != null) {
    return key;
  }

  if (covidTracerMigration.findPublicKey == null) {
    throw new Error("findPublicKey is missing from covidTracerMigration");
  }

  if (config.DbEncryptionKey == null) {
    throw new Error("Must configure DbEncryptionKey for iOS");
  }

  const phrase = await covidTracerMigration.findPublicKey();

  if (phrase == null) {
    return toByteArray(config.DbEncryptionKey);
  }

  key = toByteArray(phrase);

  logInfo(`public db key: ${maskToken(phrase)}`);

  return key;
};
