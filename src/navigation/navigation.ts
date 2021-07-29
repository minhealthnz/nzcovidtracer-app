import { DiaryScreen } from "@features/diary/screens";
import { ENFScreen } from "@features/enf/screens";
import { OnboardingScreen } from "@features/onboarding/screens";
import { ScanScreen } from "@features/scan/screens";
import { NavigationContainerRef } from "@react-navigation/native";
import { TabScreen } from "@views/screens";
import { createRef } from "react";

export const navigationRef = createRef<NavigationContainerRef>();
let waitForNavigation: null | { name: Screen; params?: any } = null;
export const setWaitForNavigation = (
  val: null | { name: Screen; params?: any },
) => (waitForNavigation = val);
export const getWaitForNavigation = () => waitForNavigation;

type Screen =
  | TabScreen
  | ScanScreen
  | OnboardingScreen
  | ENFScreen
  | DiaryScreen;

export function navigate(name: Screen, params?: any) {
  if (navigationRef.current?.navigate) {
    navigationRef.current?.navigate(name, params);
  } else {
    setWaitForNavigation({ name, params });
  }
}
