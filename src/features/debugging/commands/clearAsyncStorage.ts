import AsyncStorage from "@react-native-async-storage/async-storage";

import { TestCommand } from "../testCommand";

export const clearAsyncStorage: TestCommand = {
  command: "clear",
  run: async () => {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      AsyncStorage.removeItem(key);
    }
  },
  title: "Clear async storage",
  description: "Clear everything else",
};
