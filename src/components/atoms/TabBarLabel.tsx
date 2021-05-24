import { Text } from "@components/atoms/Text";
import { LabelPosition } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import React from "react";

export function TabBarLabel(props: {
  focused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
}) {
  return (
    <Text
      fontFamily="open-sans-semi-bold"
      color={props.color}
      fontSize={10}
      lineHeight={12}
      maxFontSizeMultiplier={1.25}
    >
      {props.children}
    </Text>
  );
}
