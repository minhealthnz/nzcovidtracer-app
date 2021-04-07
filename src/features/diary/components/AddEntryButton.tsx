import { colors, fontFamilies } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const AddEntryButtonView = styled.View`
  align-items: center;
  justify-content: center;
  padding-right: 20px;
`;

const AddEntry = styled.Text`
  text-decoration: underline;
  color: ${colors.primaryBlack};
  font-size: 14px;
  font-family: ${fontFamilies["open-sans-bold"]};
`;

interface Props {
  handleAddEntry: () => void;
}

export function AddEntryButton({ handleAddEntry }: Props) {
  const { t } = useTranslation();

  return (
    <AddEntryButtonView>
      <AddEntry
        onPress={handleAddEntry}
        accessibilityLabel={t("screens:diary:addEntryAccessibilityLabel")}
        accessibilityHint={t("screens:diary:addEntryAccessibilityHint")}
        accessibilityRole="button"
      >
        {t("screens:diary:addEntry")}
      </AddEntry>
    </AddEntryButtonView>
  );
}
