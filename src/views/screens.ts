import { DiaryScreen } from "@features/diary/screens";
import { RequestCallbackScreen } from "@features/exposure/screens";
import { NHIScreen } from "@features/nhi/screens";
import { OnboardingScreen } from "@features/onboarding/screens";
import { OTPScreen } from "@features/otp/screens";
import { ScanScreen } from "@features/scan/screens";

export enum TabScreen {
  Navigator = "TabScreen/Navigator",
  Home = "TabScreen/Home",
  RecordVisit = "TabScreen/RecordVisit",
  MyData = "TabScreen/MyData",
}

export enum MainStackScreen {
  Navigator = "MainStack/Navigator",
}

export type AnyScreen =
  | TabScreen
  | MainStackScreen
  | ScanScreen
  | NHIScreen
  | OTPScreen
  | DiaryScreen
  | RequestCallbackScreen
  | OnboardingScreen;
