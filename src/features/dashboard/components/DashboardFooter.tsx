import InfoBlock from "@components/molecules/InfoBlock";
import React from "react";
import { useTranslation } from "react-i18next";

export function DashboardFooter() {
  const { t } = useTranslation();
  return (
    <InfoBlock
      icon={require("../assets/icons/wash-your-hands.png")}
      heading={t("screens:dashboard:footer:title")}
      body={t("screens:dashboard:footer:detail")}
    />
  );
}
