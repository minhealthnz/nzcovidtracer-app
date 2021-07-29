import InfoBlock from "@components/molecules/InfoBlock";
import { colors } from "@constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { setHasSeenSaveLocations } from "../reducer";

export function DashboardSaveLocationsInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSaveLocationInfoDismiss = useCallback(() => {
    dispatch(setHasSeenSaveLocations());
  }, [dispatch]);

  return (
    <InfoBlock
      heading={t("screens:dashboard:saveLocationsInfo:title")}
      body={t("screens:dashboard:saveLocationsInfo:description")}
      backgroundColor={colors.lightBlue}
      onDismiss={handleSaveLocationInfoDismiss}
    />
  );
}
