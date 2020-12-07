import { Text } from "@components/atoms";
import { fontSizes } from "@constants";
import React from "react";
import { TextStyle } from "react-native";
import styled from "styled-components/native";

export interface LabelProps {
  text: string;
  textStyle?: TextStyle;
  onPress?(): void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const TouchableOpacity = styled.TouchableOpacity`
  padding: 8px 8px;
  justify-content: center;
`;

export function Link({
  text,
  textStyle,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: LabelProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Text
        fontSize={fontSizes.normal}
        lineHeight={24}
        fontFamily="baloo-semi-bold"
        style={textStyle}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
