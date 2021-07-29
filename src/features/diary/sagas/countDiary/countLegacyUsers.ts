import { createPrivate } from "@db/create";
import { count as countCheckIns } from "@db/entities/checkInItem";
import { User } from "@db/entities/user";
import { setLegacyUsers } from "@domain/user/reducer";
import { selectLegacyUsers } from "@domain/user/selectors";
import { setCountedOldDiaries } from "@features/diary/commonActions";
import { setCount } from "@features/diary/reducer";
import { setCheckInsCopied } from "@features/migration/reducer";
import { createLogger } from "@logger/createLogger";
import { maskToken } from "@utils/mask";
import { SagaIterator } from "redux-saga";
import { all, call, put, select, take } from "redux-saga/effects";

const { logInfo, logError } = createLogger("saga/countLegacyUsers");

export function* countLegacyUsers(): SagaIterator {
  yield all([take(setCheckInsCopied), take(setLegacyUsers)]);
  let db: Realm | undefined;
  let hasOldDiary = false;
  try {
    db = yield call(createPrivate);
    const legacyUsers: User[] = yield select(selectLegacyUsers);
    for (const legacyUser of legacyUsers) {
      const count: number = yield call(countCheckIns, legacyUser.id);
      if (count > 0) {
        hasOldDiary = true;
      }
      yield put(
        setCount({
          userId: legacyUser.id,
          count,
        }),
      );
      logInfo(`user ${maskToken(legacyUser.id)} has ${count} entries`);
    }
  } catch (err) {
    yield call(logError, err);
    db?.close();
  } finally {
    yield put(setCountedOldDiaries(hasOldDiary));
  }
}
