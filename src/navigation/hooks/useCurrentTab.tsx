import { selectCurrentRouteName } from "@features/device/selectors";
import { TabScreen } from "@views/screens";
import { useRef } from "react";
import { useSelector } from "react-redux";

import { useInitialTab } from "./useInitialTab";

export type AnyTab = TabScreen.Home | TabScreen.RecordVisit | TabScreen.MyData;

export const tabs: AnyTab[] = [
  TabScreen.Home,
  TabScreen.RecordVisit,
  TabScreen.MyData,
];

export function useCurrentTab(): AnyTab {
  const initialTab = useInitialTab();
  const routeName = useSelector(selectCurrentRouteName) || initialTab;

  const lastTab = useRef<AnyTab>();

  if ((tabs as string[]).includes(routeName)) {
    lastTab.current = routeName as AnyTab;
    return routeName as AnyTab;
  }

  if (lastTab.current == null) {
    return initialTab;
  }

  return lastTab.current;
}
