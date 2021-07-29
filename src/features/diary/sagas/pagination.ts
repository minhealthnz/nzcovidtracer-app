import { createPrivate } from "@db/create";
import { CheckInItem, queryResults } from "@db/entities/checkInItem";
import { createLogger } from "@logger/createLogger";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator, Task } from "redux-saga";
import { call, cancel, fork, put, select, take } from "redux-saga/effects";

import { mapDiaryEntry } from "../mappers";
import {
  addLoadedEntries,
  loadNextPage,
  refresh,
  setQuerying,
  StartPaginationSession,
  startPaginationSession,
  stopPagniationSession,
} from "../reducer";
import { selectSessions } from "../selectors";

const { logInfo } = createLogger("dairy/pagination");

export function* pagination(): SagaIterator {
  while (true) {
    const action: PayloadAction<StartPaginationSession> = yield take(
      startPaginationSession,
    );
    const sessionId = action.payload.sessionId;
    logInfo("Starting a new session");
    yield fork(pagniationSession, sessionId);
  }
}

function* pagniationSession(sessionId: string): SagaIterator {
  const task: Task = yield fork(loadNextPages, sessionId);

  while (true) {
    const action: PayloadAction<string> = yield take(
      stopPagniationSession.type,
    );
    if (action.payload === sessionId) {
      yield cancel(task);
    }
  }
}

function* loadNextPages(sessionId: string): SagaIterator {
  let db: Realm | undefined;
  try {
    yield put(
      setQuerying({
        sessionId,
        querying: true,
      }),
    );
    logInfo("Creating db resource");
    db = yield call(createPrivate);
    const sessions = yield select(selectSessions);
    const userIds = sessions[sessionId].userIds;
    const endOfToday = new Date();
    /* Entries are allowed to be added with start date in the future 
      up to the end of the current day */
    endOfToday.setHours(23, 59, 59, 0);
    const results = queryResults(db!, userIds, endOfToday);
    let pointer = 0;
    const pageSize = 12;
    while (true) {
      yield put(
        setQuerying({
          sessionId,
          querying: true,
        }),
      );
      const entries: CheckInItem[] = results
        .slice(pointer, pointer + pageSize)
        .map((x) => x.toJSON());
      logInfo(`Load page ${pointer} ${pageSize}`);
      yield put(
        addLoadedEntries({
          sessionId,
          entries: entries.map(mapDiaryEntry),
        }),
      );
      pointer += pageSize;
      yield put(
        setQuerying({
          sessionId,
          querying: false,
        }),
      );
      const action: Action = yield take([loadNextPage, refresh]);
      logInfo("Start loading next page");
      if (action.type === refresh.type) {
        pointer = 0;
      }
    }
  } catch (err) {
    // TODO show error
  } finally {
    yield put(
      setQuerying({
        sessionId,
        querying: false,
      }),
    );
    logInfo("Releasing db resource");
    db?.close();
  }
}
