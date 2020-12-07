import { SagaIterator } from "redux-saga";
import { all, call, fork } from "redux-saga/effects";

import config, { Feature } from "../../../config";
import { pollExposureEvents } from "./pollExposureEvents";
import { updateMatch } from "./updateMatch";

export default function* sagaWatcher(): SagaIterator {
  if (config.Features.has(Feature.PollEvents)) {
    yield fork(pollExposureEvents);
  }

  yield all([call(updateMatch)]);
}
