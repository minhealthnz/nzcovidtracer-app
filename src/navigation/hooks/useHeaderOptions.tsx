import { getHeaderOptions as getDashboard } from "@features/dashboard/getHeaderOptions";
import { getHeaderOptions as getProfile } from "@features/profile/getHeaderOptions";
import { getHeaderOptions as getScan } from "@features/scan/getHeaderOptions";
import { TabScreen } from "@views/screens";

import { useCurrentTab } from "./useCurrentTab";

export function useHeaderOptions() {
  const currentTab = useCurrentTab();
  return getHeaderOptions(currentTab);
}

function getHeaderOptions(routeName: string) {
  switch (routeName) {
    case TabScreen.Home:
      return getDashboard();
    case TabScreen.RecordVisit:
      return getScan();
    case TabScreen.MyData:
      return getProfile();
    default:
      return {};
  }
}
