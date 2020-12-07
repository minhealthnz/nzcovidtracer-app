import { createLogger } from "@logger/createLogger";
import { maskToken } from "@utils/mask";
import { toByteArray } from "base64-js";

import config from "../config";
import covidTracerMigration from "./covidTracerMigration";
import { GetPrivateDbKeyOptions } from "./getPrivateDbKey";

// Key never changes
let key: Uint8Array | undefined;

const { logInfo } = createLogger("getPrivateDbKey.ios");

export default async function getPrivateDbKey(
  _options: GetPrivateDbKeyOptions,
): Promise<Uint8Array> {
  if (key != null) {
    return key;
  }

  if (covidTracerMigration.findPrivateKey == null) {
    throw new Error("findPrivateKey is missing from covidTracerMigration");
  }

  if (config.DbEncryptionKey == null) {
    throw new Error("Must configure DbEncryptionKey for iOS");
  }

  const phrase = await covidTracerMigration.findPrivateKey();

  if (phrase == null) {
    return toByteArray(config.DbEncryptionKey);
  }

  key = toByteArray(phrase);

  logInfo(`private db key: ${maskToken(phrase)}`);

  return key;
}
