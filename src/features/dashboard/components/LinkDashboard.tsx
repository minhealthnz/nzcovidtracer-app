import { SwitchContext } from "@features/dashboard/components/SwitchProvider";
import { useHandleLink } from "@navigation/hooks/useHandleLink";
import { TabScreen } from "@views/screens";
import { useCallback, useContext } from "react";

import { navigationRef } from "../../../navigation/navigation";

export function LinkDashboard() {
  const { setIndex } = useContext(SwitchContext);

  useHandleLink(
    "dashboard/today",
    useCallback(() => {
      setIndex(0);
      navigationRef.current?.navigate(TabScreen.Home);
    }, [setIndex]),
  );

  useHandleLink(
    "dashboard/resources",
    useCallback(() => {
      setIndex(1);
      navigationRef.current?.navigate(TabScreen.Home);
    }, [setIndex]),
  );

  return null;
}
