import { selectENFAlert } from "@features/enfExposure/selectors";
import { selectMatch } from "@features/exposure/selectors";
import {
  selectHasSeenDashboard,
  selectHasSeenDashboardEnf,
} from "@features/onboarding/selectors";
import { TabScreen } from "@views/screens";
import { useRef } from "react";
import { useSelector } from "react-redux";

export function useInitialTab() {
  const hasSeenDashboard = useSelector(selectHasSeenDashboard);
  const hasSeenDashboardEnf = useSelector(selectHasSeenDashboardEnf);
  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);

  const hasAlertOnDashboard = Boolean(exposureMatch || enfAlert);

  // Initial tab is only evaluated once
  const initialTab = useRef<TabScreen.Home | TabScreen.RecordVisit>(
    !hasSeenDashboard || !hasSeenDashboardEnf || hasAlertOnDashboard
      ? TabScreen.Home
      : TabScreen.RecordVisit,
  );

  return initialTab.current;
}
