import { Text } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes } from "@constants";
import { LabelPosition } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const _TabBarLabel = styled(Text)<{ focused: boolean }>`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.xSmall}px;
  line-height: 12px;
  margin-bottom: ${(props) => (props.focused ? 0 : 3)}px;
  color: ${(props) =>
    props.focused ? colors.primaryBlack : colors.primaryGray};
`;

const _TabBarContainer = styled(View)<{ focused: boolean }>`
  border-bottom-width: ${(props) => (props.focused ? 3 : 0)}px;
  border-color: ${colors.primaryBlack};
`;

export function TabBarLabel(props: {
  focused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
}) {
  return (
    <_TabBarContainer focused={props.focused}>
      <_TabBarLabel focused={props.focused} maxFontSizeMultiplier={1.25}>
        {props.children}
      </_TabBarLabel>
    </_TabBarContainer>
  );
}
