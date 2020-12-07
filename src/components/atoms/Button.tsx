import { colors, fontSizes } from "@constants";
import React, { useMemo } from "react";
import { TextStyle, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { testable } from "../../testable";
import { LoadingSpinner } from "./LoadingSpinner";
import { Text } from "./Text";

interface ButtonProps {
  text: string;
  buttonColor?: ButtonColor;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
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

  return (
    <Container
      color={color}
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityHint={accessibilityHint}
    >
      {isLoading && (
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
