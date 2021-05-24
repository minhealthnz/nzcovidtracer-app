import { colors, fontFamilies, fontSizes, grid } from "@constants";
import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";

const Section = styled.View`
  margin-bottom: ${grid}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitleView = styled.View`
  flex-direction: column;
`;

const SectionTitle = styled(Text)`
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  color: ${colors.primaryGray};
`;

const SectionSubTitle = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  line-height: 16px;
  color: ${colors.primaryGray};
`;

const SectionCTA = styled.TouchableOpacity`
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  height: 20px;
`;

const SectionCTATitle = styled.Text`
  line-height: 20px;
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-bold"]};
  text-decoration-line: underline;
`;

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  ctaTitle?: string;
  ctaAccessibilityTitle?: string;
  onCtaPress?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  ctaTitle,
  ctaAccessibilityTitle,
  onCtaPress,
  style,
}: SectionHeaderProps) {
  return (
    <Section style={style}>
      <SectionTitleView accessible={true}>
        {Boolean(title) && (
          <SectionTitle accessibilityRole="header">{title}</SectionTitle>
        )}
        {Boolean(subtitle) && <SectionSubTitle>{subtitle}</SectionSubTitle>}
      </SectionTitleView>
      {Boolean(ctaTitle) && (
        <SectionCTA
          accessibilityLabel={ctaAccessibilityTitle || ctaTitle}
          accessibilityRole="button"
          onPress={onCtaPress}
        >
          <SectionCTATitle>{ctaTitle}</SectionCTATitle>
        </SectionCTA>
      )}
    </Section>
  );
}
