import { createLogger } from "@logger/createLogger";
import messaging from "@react-native-firebase/messaging";

const { logInfo } = createLogger("reminder/subscribeToTopic");

export function subscribeTopic(topic: string) {
  logInfo("Unsubscribing to Topic");
  const fcm = messaging();
  return new Promise((resolve, reject) => {
    fcm
      .subscribeToTopic(topic)
      .then((res) => {
        resolve(res);
      })
      .catch((er) => {
        logInfo("Error subscribing to topic");
        reject(er);
      });
  });
}
