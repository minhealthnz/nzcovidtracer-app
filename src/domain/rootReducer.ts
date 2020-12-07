import device from "@domain/device/reducer";
import user from "@domain/user/reducer";
import debugging from "@features/debugging/reducer";
import diary from "@features/diary/reducer";
import enf from "@features/enf/reducer";
import enfExposure from "@features/enfExposure/reducer";
import exposure from "@features/exposure/reducer";
import migration from "@features/migration/reducer";
import onboarding from "@features/onboarding/reducer";
import otp from "@features/otp/reducer";
import verification from "@features/verification/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user,
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
});
