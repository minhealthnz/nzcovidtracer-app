import { SwitchContext } from "@features/dashboard/components/SwitchProvider";
import { matchDeeplink } from "@linking/matchers";
import { useHandleLink } from "@linking/useHandleLink";
import { TabScreen } from "@views/screens";
import { useCallback, useContext } from "react";

import { navigationRef } from "../../../navigation/navigation";

export function LinkDashboard() {
  const { setIndex } = useContext(SwitchContext);

  useHandleLink(
    {
      matcher: matchDeeplink("dashboard/today"),
    },
    useCallback(() => {
      setIndex(0);
      navigationRef.current?.navigate(TabScreen.Home);
    }, [setIndex]),
  );

  useHandleLink(
    {
      matcher: matchDeeplink("dashboard/resources"),
    },
    useCallback(() => {
      setIndex(1);
      navigationRef.current?.navigate(TabScreen.Home);
    }, [setIndex]),
  );

  return null;
}
