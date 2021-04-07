import { OnboardingScreen } from "@features/onboarding/screens";
import { ScanScreen } from "@features/scan/screens";
import { NavigationContainerRef } from "@react-navigation/native";
import { TabScreen } from "@views/screens";
import { createRef } from "react";

export const navigationRef = createRef<NavigationContainerRef>();

type Screen = TabScreen | ScanScreen | OnboardingScreen;

export function navigate(name: Screen) {
  navigationRef.current?.navigate(name);
}
