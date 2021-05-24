import { colors, fontFamilies } from "@constants";
import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

export interface HeaderButtonProps {
  text: string;
  onPress?(): void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding-right: 20px;
`;

const Title = styled.Text`
  text-decoration: underline;
  color: ${colors.primaryBlack};
  font-size: 14px;
  font-family: ${fontFamilies["open-sans-bold"]};
`;

export function HeaderButton({
  onPress,
  text,
  accessibilityLabel,
  accessibilityHint,
  style,
}: HeaderButtonProps) {
  return (
    <Container style={style}>
      <Title
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        allowFontScaling={false}
      >
        {text}
      </Title>
    </Container>
  );
}
