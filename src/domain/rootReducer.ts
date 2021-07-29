import user from "@domain/user/reducer";
import announcement from "@features/announcement/reducer";
import dashboard from "@features/dashboard/reducer";
import debugging from "@features/debugging/reducer";
import device from "@features/device/reducer";
import diary from "@features/diary/reducer";
import enf from "@features/enf/reducer";
import enfExposure from "@features/enfExposure/reducer";
import exposure from "@features/exposure/reducer";
import locations from "@features/locations/reducer";
import migration from "@features/migration/reducer";
import nfc from "@features/nfc/reducer";
import onboarding from "@features/onboarding/reducer";
import otp from "@features/otp/reducer";
import reminder from "@features/reminder/reducer";
import resources from "@features/resources/reducer";
import verification from "@features/verification/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user,
  dashboard,
  diary,
  device,
  enf,
  enfExposure,
  exposure,
  migration,
  onboarding,
  otp,
  verification,
  debugging,
  announcement,
  resources,
  locations,
  reminder,
  nfc,
});
