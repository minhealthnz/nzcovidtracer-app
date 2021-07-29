import { DiaryScreen } from "@features/diary/screens";
import { ENFScreen } from "@features/enf/screens";
import { NotificationUserInfo } from "@features/exposure/reducer";
import { NotificationTypeMatchFound } from "@features/exposure/service/types";
import { ReminderNotificationType } from "@features/reminder/service/scheduleReminders";
import { ENFSupportRetrySuccess } from "@features/verification/types";
import { navigate } from "@navigation/navigation";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { TabScreen } from "@views/screens";
import PushNotification from "react-native-push-notification";

import { AnalyticsEvent, recordAnalyticEvent } from "./analytics";

export function configure() {
  PushNotification.configure({
    onRegister: function (_token) {
      // TODO Display a dev error
    },

    onNotification: function (notification) {
      const data: NotificationUserInfo = notification.data;
      if (data.isLocal) {
        if (data.type === ReminderNotificationType) {
          recordAnalyticEvent(AnalyticsEvent.ReminderNotificationOpened);
          navigate(DiaryScreen.Diary);
        }
        if (data.type === NotificationTypeMatchFound) {
          // TODO confirm it works from launch
          recordAnalyticEvent(AnalyticsEvent.ExposureNotificationOpened);
          navigate(TabScreen.Home);
        }
        if (data.type === ENFSupportRetrySuccess) {
          recordAnalyticEvent(AnalyticsEvent.ENFSupportRetrySuccess);
          navigate(TabScreen.Home);
          navigate(ENFScreen.Settings, {
            retryPassed: true,
          });
        }
      }

      // TODO: handle a tap on the Local push notification sent by ENF module:
      // 1. record analytics event to track the number of close contact events that are being raised and if the user
      //    reacts to the in-app notification. Monitor the effectiveness of the in-app notification as an alert
      //    mechanism. Monitor the scope and activity of the app-enabled contact tracing network.
      // 2. Navigate user to the Dashboard screen
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onRegistrationError: function (_err) {
      // TODO Display a dev error
    },

    requestPermissions: false,
  });
}
