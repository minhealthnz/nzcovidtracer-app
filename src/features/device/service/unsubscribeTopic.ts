import { createLogger } from "@logger/createLogger";
import messaging from "@react-native-firebase/messaging";

const { logInfo } = createLogger("reminder/unsubscribeToTopic");

export function unsubscribeTopic(topic: string) {
  logInfo("Unsubscribing to Topic");
  const fcm = messaging();
  return new Promise((resolve, reject) => {
    fcm
      .unsubscribeFromTopic(topic)
      .then((res) => {
        resolve(res);
      })
      .catch((er) => {
        logInfo("Error unsubscribing to topic");
        reject(er);
      });
  });
}
