import { HeaderButton } from "@components/atoms/HeaderButton";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  handleAddEntry: () => void;
}

export function AddEntryButton({ handleAddEntry }: Props) {
  const { t } = useTranslation();

  return (
    <HeaderButton
      text={t("screens:diary:addEntry")}
      accessibilityLabel={t("screens:diary:addEntryAccessibilityLabel")}
      accessibilityHint={t("screens:diary:addEntryAccessibilityHint")}
      onPress={handleAddEntry}
    />
  );
}
