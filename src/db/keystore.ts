import { createLogger } from "@logger/createLogger";
import { getGenericPassword } from "react-native-keychain";
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
/**
 * set a value by key
 * @param accessible iOS only. sets the accessible level of the item.
 * by default, it's ACCESSIBLE.WHEN_UNLOCKED
 */
export const set = async (
  key: string,
  value: string,
  accessible = ACCESSIBLE.WHEN_UNLOCKED,
) => {
  await RNSecureKeyStore.set(key, value, {
    /**
     * Only affects iOS
     */
    accessible,
  });
};

const { logInfo } = createLogger("keystore");

export const get = async (key: string) => {
  try {
    return await RNSecureKeyStore.get(key);
  } catch (err) {
    // Key does not exist..
    if (err.code === "404") {
      /**
       * This is needed as pilot users uses react-native-keychain,
       * will attempt to retrieve value from react-native-keychain,
       * if it exists, migrate it to react-native-key-store.
       */
      const value = (await getFromKeychain(key))?.password;
      if (value) {
        logInfo("migrating key from react-native-keychain...");
        await set(key, value);
      } else {
        logInfo("no key exists in react-native-keychain");
      }
      return value;
    }
    throw err;
  }
};

const getFromKeychain = async (key: string) => {
  const password = await getGenericPassword({
    service: key,
  });
  return password || null;
};
