import InfoBlock from "@components/molecules/InfoBlock";
import { colors } from "@constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { setHasSeenSwipeInfo } from "../reducer";

export function DashboardSwipeInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSwipeInfoDismiss = useCallback(() => {
    dispatch(setHasSeenSwipeInfo());
  }, [dispatch]);

  return (
    <InfoBlock
      heading={t("screens:dashboard:swipeInfo:title")}
      body={t("screens:dashboard:swipeInfo:description")}
      icon={require("../assets/icons/swipe.png")}
      backgroundColor={colors.lightBlue}
      onDismiss={handleSwipeInfoDismiss}
    />
  );
}
