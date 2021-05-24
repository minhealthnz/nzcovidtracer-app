import React from "react";
import { useTranslation } from "react-i18next";

import { DashboardHeader } from "./components/DashboardHeader";
import { UniteLogo } from "./components/UniteLogo";

export function getHeaderOptions() {
  return {
    headerLeft: () => <HeaderLeft />,
    headerTitle: () => <DashboardHeader />,
  };
}

function HeaderLeft() {
  const { t } = useTranslation();
  return (
    <UniteLogo
      accessible
      accessibilityLabel={t("accessibility:graphic:COVID19OfficialLogo")}
      source={require("@features/dashboard/assets/icons/unite-logo.png")}
    />
  );
}
