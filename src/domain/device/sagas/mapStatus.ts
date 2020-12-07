import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

import { PermissionStatus } from "../reducer";

export function mapStatus(
  status: FirebaseMessagingTypes.AuthorizationStatus,
): PermissionStatus {
  switch (status) {
    case messaging.AuthorizationStatus.NOT_DETERMINED:
      return "denied";
    case messaging.AuthorizationStatus.AUTHORIZED:
    case messaging.AuthorizationStatus.PROVISIONAL:
      return "granted";
    case messaging.AuthorizationStatus.DENIED:
      return "blocked";
  }
}
