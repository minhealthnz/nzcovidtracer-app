import { TabScreen } from "@views/screens";
import { useRef } from "react";

export function useInitialTab() {
  // Initial tab is only evaluated once
  const initialTab = useRef<TabScreen.Home>(TabScreen.Home);

  return initialTab.current;
}
