import { fontFamilies, fontSizes, grid2x, grid3x, grid4x } from "@constants";
import React from "react";
import {
  AccessibilityProps,
  AccessibilityRole,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";

export const Container = styled.TouchableOpacity<{ align?: "center" | "left" }>`
  padding: ${grid2x}px ${grid4x}px ${grid3x}px
    ${(props) => (props.align === "left" ? 0 : grid4x)}px;
  align-items: ${(props) => (props.align === "left" ? "flex-start" : "center")};
`;

export const Title = styled(Text)`
  font-size: ${fontSizes.large}px;
  text-decoration-line: underline;
  font-family: ${fontFamilies["open-sans-bold"]};
`;

export interface SecondaryButtonProps extends AccessibilityProps {
  text: string;
  onPress?(): void;
  style?: ViewStyle;
  align?: "center" | "left";
  accessibilityRole?: AccessibilityRole;
  textStyle?: TextStyle;
}

export function SecondaryButton({
  onPress,
  text,
  align,
  textStyle,
  accessibilityRole,
  ...otherProps
}: SecondaryButtonProps) {
  return (
    <Container
      onPress={onPress}
      accessibilityRole={accessibilityRole ? accessibilityRole : "button"}
      {...otherProps}
      align={align}
    >
      <Title style={textStyle}>{text}</Title>
    </Container>
  );
}

const styles = {
  small: StyleSheet.create({
    container: {
      paddingTop: 14,
      paddingBottom: 20,
    },
    text: {
      fontSize: fontSizes.small,
    },
  }),
};

export const presets: { [key: string]: Partial<SecondaryButtonProps> } = {
  small: {
    style: styles.small.container,
    textStyle: styles.small.text,
  },
};
