import { colors, fontSizes } from "@constants";
import React, { useMemo } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { testable } from "../../testable";
import { LoadingSpinner } from "./LoadingSpinner";
import { Text } from "./Text";

export interface ButtonProps {
  text: string;
  buttonColor?: ButtonColor;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "none";
}

export type ButtonColor = "black" | "green";

interface ContainerProps {
  color: string;
}

const Container = styled.TouchableOpacity`
  background-color: ${(props: ContainerProps) => props.color};
  width: 100%;
  padding: 19px 16px 20px 16px;
  align-items: center;
`;

const SpinnerView = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
`;

function Button({
  text,
  buttonColor,
  onPress,
  style,
  textStyle,
  isLoading,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}: ButtonProps) {
  const color = useMemo(() => {
    switch (buttonColor) {
      case "green":
        return colors.green;
      default:
        return colors.black;
    }
  }, [buttonColor]);

  const textColor = useMemo(() => {
    switch (buttonColor) {
      case "black":
        return colors.white;
      case "green":
        return colors.black;
      default:
        return colors.white;
    }
  }, [buttonColor]);

  const _accessibilityRole = accessibilityRole || "button";

  return (
    <Container
      color={color}
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
      disabled={isLoading}
      accessibilityRole={_accessibilityRole}
      accessibilityLabel={accessibilityLabel || text}
      accessibilityHint={accessibilityHint}
    >
      {isLoading && onPress != null && (
        <SpinnerView>
          <LoadingSpinner />
        </SpinnerView>
      )}
      <Text
        color={isLoading ? "transparent" : textColor}
        fontSize={fontSizes.large}
        fontFamily="open-sans-bold"
        style={textStyle}
        maxFontSizeMultiplier={2}
      >
        {text}
      </Text>
    </Container>
  );
}

export default testable(Button);

const styles = {
  small: StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    text: {
      fontSize: fontSizes.small,
    },
  }),
};

export const presets: { [key: string]: Partial<ButtonProps> } = {
  small: {
    style: styles.small.container,
    textStyle: styles.small.text,
  },
};
