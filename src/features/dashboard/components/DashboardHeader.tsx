import { Switch } from "@components/molecules/Switch";
import { selectCurrentRouteName } from "@features/device/selectors";
import { useFocusView } from "@navigation/hooks/useFocusView";
import { TabScreen } from "@views/screens";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useDashboardTitleHint } from "../hooks/useDashboardTitleHint";
import { SwitchContext } from "./SwitchProvider";

export function DashboardHeader() {
  const { index } = useContext(SwitchContext);

  const { t } = useTranslation();

  const currentRouteName = useSelector(selectCurrentRouteName);

  const { focusView, ref: switchRef } = useFocusView();

  useEffect(() => {
    if (currentRouteName === TabScreen.Home) {
      focusView();
    }
  }, [currentRouteName, focusView]);

  const titles = [t("topTabs:today"), t("topTabs:resources")];

  const numberOfTabs = titles.length;

  const { accessibilityLabel, accessibilityHint } = useDashboardTitleHint(
    index,
    numberOfTabs,
  );

  return (
    <Switch
      ref={switchRef}
      titles={titles}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    />
  );
}
