import { toByteArray } from "base64-js";

import config from "../config";

export default async () => {
  return config.DbEncryptionKey == null
    ? undefined
    : toByteArray(config.DbEncryptionKey);
};
