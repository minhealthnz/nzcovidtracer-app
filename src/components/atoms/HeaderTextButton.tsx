import { fontFamilies, fontSizes } from "@constants";
import { grid2x } from "@constants";
import React from "react";
import styled from "styled-components/native";

const Title = styled.Text`
  text-decoration-line: underline;
  font-family: ${fontFamilies["open-sans-bold"]}
  font-size: ${fontSizes.small}px
`;

const Container = styled.TouchableOpacity`
  padding-right: ${grid2x}px;
  padding-left: 24px;
  justify-content: center;
  align-items: center;
`;

export interface HeaderTextButtonProps {
  onPress(): void;
  title: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function HeaderTextButton({
  onPress,
  title,
  accessibilityLabel,
  accessibilityHint,
}: HeaderTextButtonProps) {
  return (
    <Container
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Title maxFontSizeMultiplier={1.5}>{title}</Title>
    </Container>
  );
}
