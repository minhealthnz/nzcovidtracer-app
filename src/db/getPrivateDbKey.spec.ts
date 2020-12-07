import { toByteArray } from "base64-js";

// @ts-ignore fix jest resolving to the .ios.ts file
import getPrivateDbKey from "../db/getPrivateDbKey.ts";

const cache: { [key: string]: string } = {};
async function getPassword(service: string) {
  return cache[service];
}

async function setPassword(service: string, password: string) {
  cache[service] = password;
}

async function randomBytes(num: number) {
  const bytes = [];
  for (let i = 0; i < num; i++) {
    bytes.push(Math.floor(Math.random() * 128));
  }
  return new Uint8Array(bytes);
}

async function queueGetPrivateDbKey(service: string) {
  return getPrivateDbKey({
    shouldGenerate: true,
    service,
    getPassword,
    setPassword,
    randomBytes,
  });
}

it("can generate 1000 keys in parallel", async () => {
  const num = 1000;
  const tasks = [];
  for (let i = 0; i < num; i++) {
    tasks.push(queueGetPrivateDbKey("foo"));
  }

  const keys = await Promise.all(tasks);

  for (let i = 0; i < num - 1; i++) {
    expect(keys[i]).toEqual(keys[i + 1]);
  }
});

it("caches keys generated", async () => {
  const key1 = await getPrivateDbKey({
    shouldGenerate: true,
    service: "bar",
    getPassword,
    setPassword,
    randomBytes,
  });

  const key2 = await getPrivateDbKey({
    shouldGenerate: true,
    service: "bar",
    getPassword,
    setPassword,
    randomBytes,
  });

  expect(key1).toEqual(key2);
});

it("uses defaultKey if not generating", async () => {
  const defaultKey =
    "mlaTvpz4hSvH3zzYYJxA2PzQ5VKc1QpCtz8Hi4xMksv+KtpzhHb3fIzo2t91Jv1aFpJTSemKSH1Y2B0jnOB96g==";
  const key = await getPrivateDbKey({
    shouldGenerate: false,
    defaultKey,
    getPassword,
    setPassword,
    randomBytes,
  });

  expect(key).toEqual(toByteArray(defaultKey));
});
