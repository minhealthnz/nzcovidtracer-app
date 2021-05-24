import { SectionHeader } from "@components/atoms/SectionHeader";
import { Text } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

interface DiarySectionHeaderProps {
  title?: string;
  showOldDiaryTitle?: boolean;
  ctaTitle?: string;
  ctaCallback?(): void;
  accessibilityLabel?: string;
}

const OldEntryTitle = styled(Text)`
  padding-top: 30px;
  color: ${colors.primaryBlack};
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
`;

export function DiarySectionHeader({
  title,
  showOldDiaryTitle,
  ctaTitle,
  ctaCallback,
  accessibilityLabel,
}: DiarySectionHeaderProps) {
  const { t } = useTranslation();
  return title ? (
    <>
      {showOldDiaryTitle ? (
        <OldEntryTitle>{t("screens:diary:oldDiaryText")}</OldEntryTitle>
      ) : null}
      <SectionHeader
        subtitle={title}
        ctaAccessibilityTitle={accessibilityLabel}
        ctaTitle={ctaTitle}
        onCtaPress={ctaCallback}
        style={styles.sectionHeaderContainer}
      />
    </>
  ) : null;
}

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    paddingTop: 20,
  },
});
