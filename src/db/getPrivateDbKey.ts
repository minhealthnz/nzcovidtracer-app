import { fromByteArray, toByteArray } from "base64-js";

export interface GetPrivateDbKeyOptions {
  shouldGenerate: boolean;
  defaultKey?: string;
  service: string;
  getPassword(service: string): Promise<string | null>;
  setPassword(service: string, password: string): Promise<void>;
  randomBytes(num: number): Promise<Uint8Array>;
}

const locks: { [id: string]: boolean } = {};
const keys: { [id: string]: Promise<Uint8Array> } = {};

export default async function getPrivateDbKey(options: GetPrivateDbKeyOptions) {
  if (!options.shouldGenerate) {
    return options.defaultKey == null
      ? undefined
      : toByteArray(options.defaultKey);
  }

  if (keys[options.service] != null) {
    return keys[options.service];
  }

  keys[options.service] = createPrivateDbKey(options);

  return keys[options.service];
}

const createPrivateDbKey = async (options: GetPrivateDbKeyOptions) => {
  const service = options.service;

  const password = await options.getPassword(service);
  if (password != null) {
    return toByteArray(password);
  }

  if (locks[service]) {
    throw new Error("Attempted to create private key from two threads!!");
  }

  locks[service] = true;

  const key = await options.randomBytes(64);
  await options.setPassword(service, fromByteArray(key));

  locks[service] = false;

  return key;
};
