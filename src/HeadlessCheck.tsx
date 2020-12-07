import { createLogger } from "@logger/createLogger";
import { useAppState } from "@react-native-community/hooks";
import React, { useEffect, useState } from "react";

import { App } from "./App";

interface Prop {
  isHeadless?: boolean;
  isBackground?: boolean;
}

const { logInfo } = createLogger("HeadlessCheck.tsx");

export function HeadlessCheck({ isHeadless, isBackground }: Prop) {
  const appState = useAppState();
  const [beenActive, setBeenActive] = useState(!isBackground);

  useEffect(() => {
    if (appState === "active") {
      logInfo("set active!");
      setBeenActive(true);
    }
  }, [appState]);

  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    logInfo("is headless, ignore");
    return null;
  }

  if (!beenActive) {
    // App has been launched in the background by iOS, ignore
    logInfo("app is not active, ignore");
    return null;
  }

  return <App />;
}
