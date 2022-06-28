import { selectHasOnboarded } from "@features/onboarding/selectors";
import { createLogger } from "@logger/createLogger";
import { navigate } from "@navigation/navigation";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { TabScreen } from "@views/screens";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { call, select, takeEvery } from "redux-saga/effects";

const { logError } = createLogger("device/saga/notificationOpenedChannel");

function notificationOpenedChannel() {
  return eventChannel((emit) => {
    return messaging().onNotificationOpenedApp(
      (message: FirebaseMessagingTypes.RemoteMessage) => {
        emit(message);
      },
    );
  });
}

export function* handleNotificationOpened(): SagaIterator {
  const channel: EventChannel<FirebaseMessagingTypes.RemoteMessage> =
    yield call(notificationOpenedChannel);

  yield takeEvery(channel, onNotificationOpened);
}

function* onNotificationOpened(_message: FirebaseMessagingTypes.RemoteMessage) {
  try {
    const hasOnboarded = yield select(selectHasOnboarded);
    if (hasOnboarded) {
      navigate(TabScreen.Home);
    }
  } catch (err) {
    logError("Failed to navigate to dashboard", err);
  }
}
