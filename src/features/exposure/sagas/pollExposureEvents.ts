import { CheckInItemMatch } from "@db/entities/checkInItemMatch";
import { appDidBecomeAvailable } from "@features/device/reducer";
import { createLogger } from "@logger/createLogger";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { ExposureEventsResponse, getExposureEvents } from "../api";
import { setMatch } from "../reducer";
import { selectPollingDisabled } from "../selectors";
import { mapEvent } from "../service/mapEvent";
import { processEvents } from "../service/processEvents";

const { logError } = createLogger("saga/pollExposureEvents");

export function* pollExposureEvents(): SagaIterator {
  yield takeLatest(appDidBecomeAvailable, onPollExposureEvents);
}

function* onPollExposureEvents(): SagaIterator {
  const disabled = yield select(selectPollingDisabled);
  if (disabled) {
    return;
  }
  // TODO: Translate
  const notificationBody =
    "You may have been in contact with COVID-19. Tap for more information.";
  try {
    const response: ExposureEventsResponse = yield call(getExposureEvents);

    if (!response.items.length) {
      return;
    }

    const events = response.items
      .map(mapEvent)
      .filter((x) => x != null)
      .map((x) => x!);

    const mostRecentUnacknowledgedMatch:
      | CheckInItemMatch
      | undefined = yield call(processEvents, events, notificationBody);

    if (mostRecentUnacknowledgedMatch != null) {
      yield put(setMatch(mostRecentUnacknowledgedMatch));
    }
  } catch (error) {
    yield call(logError, error);
  }
}
