import { fontFamilies, fontSizes, grid3x, grid4x } from "@constants";
import React from "react";
import { AccessibilityProps, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";

export const Container = styled.TouchableOpacity`
  padding: ${grid4x}px;
  padding-top: ${grid3x}px;
  align-items: center;
`;

export const Title = styled(Text)`
  font-size: ${fontSizes.large}px;
  text-decoration-line: underline;
  font-family: ${fontFamilies["open-sans-bold"]};
`;

interface SecondaryButtonProps extends AccessibilityProps {
  text: string;
  onPress?(): void;
  style?: ViewStyle;
}

export function SecondaryButton({
  onPress,
  text,
  ...otherProps
}: SecondaryButtonProps) {
  return (
    <Container onPress={onPress} accessibilityRole="button" {...otherProps}>
      <Title>{text}</Title>
    </Container>
  );
}
