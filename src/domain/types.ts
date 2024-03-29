import { AnnouncementState } from "@features/announcement/reducer";
import { DashboardState } from "@features/dashboard/reducer";
import { DebuggingState } from "@features/debugging/reducer";
import { DeviceState } from "@features/device/reducer";
import { DiaryState } from "@features/diary/types";
import { ENFState } from "@features/enf/reducer";
import { ENFExposureState } from "@features/enfExposure/reducer";
import { ExposureState } from "@features/exposure/reducer";
import { LocationsState } from "@features/locations/reducer";
import { MigrationState } from "@features/migration/reducer";
import { NfcState } from "@features/nfc/reducer";
import { OnboardingState } from "@features/onboarding/reducer";
import { OTPState } from "@features/otp/reducer";
import { ReminderNotificationState } from "@features/reminder/reducer";
import { ResourcesState } from "@features/resources/reducer";
import { VerificationState } from "@features/verification/reducer";

import { UserState } from "./user/types";

export interface ReduxState {
  user: UserState;
  dashboard: DashboardState;
  diary: DiaryState;
  device: DeviceState;
  enf: ENFState;
  enfExposure: ENFExposureState;
  exposure: ExposureState;
  migration: MigrationState;
  onboarding: OnboardingState;
  otp: OTPState;
  reminder: ReminderNotificationState;
  verification: VerificationState;
  debugging: DebuggingState;
  announcement: AnnouncementState;
  resources: ResourcesState;
  locations: LocationsState;
  nfc: NfcState;
}
