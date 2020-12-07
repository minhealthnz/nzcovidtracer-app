import { getAll, update } from "@db/user";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const clearAliases: TestCommand = {
  command: "clearAliases",
  title: "Clear aliases",
  async run() {
    const users = await getAll();
    for (const user of users) {
      if (user.isAnonymous) {
        continue;
      }
      await update(user.id, (updatedUser) => (updatedUser.alias = undefined));
    }
    Alert.alert("Done");
  },
};
