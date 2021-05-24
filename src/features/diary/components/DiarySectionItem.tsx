import Button from "@components/atoms/Button";
import { Text } from "@components/atoms/Text";
import { colors, fontFamilies } from "@constants";
import { fontSizes } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

import { DiaryItem } from "../hooks/useDiarySections";
import { DiaryEntry } from "../types";
import { DiaryEntryListItem } from "./DiaryEntryListItem";

const AddManualEntryButton = styled(Button)`
  background-color: ${colors.lightGrey};
  border-style: dashed;
  border-radius: 1px;
  border-color: black;
  border-width: 1px;
  padding-bottom: 20px;
`;

const NoEntry = styled(Text)`
  padding-bottom: 20px;
  font-family: ${fontFamilies["open-sans"]}
  font-size: ${fontSizes.small}px
`;

interface DiarySectionItemProps {
  item: DiaryItem;
  handleAddEntry(startOfDay: number): void;
  startOfDay: number;
  onEntryPress(item: DiaryEntry): void;
}

export function DiarySectionItem({
  item,
  handleAddEntry,
  onEntryPress,
  startOfDay,
}: DiarySectionItemProps) {
  const { t } = useTranslation();

  switch (item) {
    case "button":
      return (
        <AddManualEntryButton
          text={t("screens:diary:addManualEntry")}
          textStyle={styles.text}
          onPress={() => handleAddEntry(startOfDay)}
          accessibilityLabel={t(
            "screens:diary:addManualEntryAccessibilityLabel",
          )}
        />
      );
    case "noEntry":
      return <NoEntry>{t("screens:diary:noEntries")}</NoEntry>;
    default:
      return (
        <DiaryEntryListItem
          hideDate={true}
          hideDay={true}
          entry={item}
          onEntryPress={() => onEntryPress(item)}
        />
      );
  }
}

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontSize: fontSizes.small,
    textDecorationLine: "underline",
  },
});
