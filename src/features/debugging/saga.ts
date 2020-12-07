import { createPrivate, createPublic } from "@db/create";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { all, call } from "redux-saga/effects";

import reactotron from "../../../reactotronConfig";
import { addCommands } from "./addCommands";

const { logError } = createLogger("printDbLocations");

function* printDbLocations(): SagaIterator {
  try {
    const privateDb = yield call(createPrivate);
    reactotron.log?.("private db is located at:", privateDb.path);
    privateDb.close();

    const publicDb = yield call(createPublic);
    reactotron.log?.("public db is located at:", publicDb.path);
    publicDb.close();
  } catch (err) {
    logError(err);
  }
}

function* addReactotronCommands() {
  try {
    yield call(addCommands, reactotron);
  } catch (err) {
    logError(err);
  }
}

export default function* sagaWatcher() {
  yield all([printDbLocations(), addReactotronCommands()]);
}
