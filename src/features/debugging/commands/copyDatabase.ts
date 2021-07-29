import { createPrivate, createPublic } from "@db/create";
import {
  CheckInItemEntity,
  CheckInItemMatchEntity,
  CheckInItemPublicEntity,
  LocationEntity,
  UserEntity,
} from "@db/entities/entities";
import Clipboard from "@react-native-community/clipboard";
import _ from "lodash";
import { Alert } from "react-native";

import { TestCommand } from "../testCommand";

export const copyDatabase: TestCommand = {
  command: "copyDatabase",
  title: "Copy database",
  async run() {
    const publicDb = await createPublic();

    const privateDb = await createPrivate();

    const entities = {
      [CheckInItemMatchEntity]: publicDb.objects(CheckInItemMatchEntity),
      [CheckInItemPublicEntity]: publicDb.objects(CheckInItemPublicEntity),
      [CheckInItemEntity]: privateDb.objects(CheckInItemEntity),
      [UserEntity]: privateDb.objects(UserEntity),
      [LocationEntity]: privateDb.objects(LocationEntity),
    };

    const result = _.mapValues(entities, (results) =>
      results.map((x) => x.toJSON()),
    );

    const text = JSON.stringify(result);
    Clipboard.setString(text);
    Alert.alert("Copied to clipboard", text);
  },
};
