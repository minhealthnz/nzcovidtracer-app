import { createPrivate } from "@db/create";
import { UserEntity } from "@db/entities";
import { User } from "@domain/user/types";
import { nanoid } from "@reduxjs/toolkit";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";
import { createCheckIns } from "./addCheckIns";

export function createAddLegacyUser(userId?: string, email?: string) {
  const addLegacyUser: TestCommand = {
    command: "addLegacyUser",
    title: "Add legacy user",
    description: email,
    async run() {
      const userIdToUse = userId ?? nanoid();
      const db = await createPrivate();
      db.write(() => {
        db.create<User>(UserEntity, {
          id: userIdToUse,
          nhi: nanoid(),
        });

        Alert.alert("Legacy user created", email);
      });
      db.close();
      createCheckIns(userIdToUse, 30);
    },
  };
  return addLegacyUser;
}
