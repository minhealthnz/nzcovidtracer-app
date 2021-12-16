import InfoBlock from "@components/molecules/InfoBlock";
import { colors } from "@constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { setHasSeenVaccinePassInfo } from "../reducer";

const assets = {
  vaccinePassIcon: require("@features/dashboard/assets/icons/vaccine-pass.png"),
};

export function DashboardVaccinePassInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleVaccinePassInfoDismiss = useCallback(() => {
    dispatch(setHasSeenVaccinePassInfo());
  }, [dispatch]);

  return (
    <InfoBlock
      heading={t("screens:dashboard:vaccinePassInfo:title")}
      body={t("screens:dashboard:vaccinePassInfo:description")}
      backgroundColor={colors.lightBlue}
      onDismiss={handleVaccinePassInfoDismiss}
      icon={assets.vaccinePassIcon}
    />
  );
}
