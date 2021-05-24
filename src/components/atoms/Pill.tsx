import { colors, fontFamilies } from "@constants";
import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";

const PillView = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const PillIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: -8px;
`;

const PillText = styled(Text)<{
  fontColor: string;
  hasMargin: boolean;
}>`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${(props) => props.fontColor};
  margin-right: ${(props) => (props.hasMargin ? 6 : 0)}px;
  margin-left: ${(props) => (props.hasMargin ? 5 : 0)}px;
`;

const assets = {
  trendUpGreen: require("@assets/icons/trend-up-green.png"),
  trendUpRed: require("@assets/icons/trend-up-red.png"),
  trendDownGreen: require("@assets/icons/trend-down-green.png"),
  trendDownRed: require("@assets/icons/trend-down-red.png"),
};

interface Props {
  backgroundColor: string;
  icon?: ImageSourcePropType;
  text: string;
  fontSize: number;
  fontColor: string;
}

export function Pill({
  backgroundColor,
  icon,
  text,
  fontSize,
  fontColor,
}: Props) {
  const hasBackground = backgroundColor !== "transparent";
  return (
    <PillView backgroundColor={backgroundColor}>
      {!!icon && <PillIcon source={icon} />}
      <PillText
        fontColor={fontColor}
        fontSize={fontSize}
        hasMargin={hasBackground || !!icon}
      >
        {text}
      </PillText>
    </PillView>
  );
}

export const presets = {
  text: {
    fontColor: colors.primaryBlack,
    backgroundColor: "transparent",
  },
  grey: {
    fontColor: colors.primaryBlack,
    backgroundColor: colors.darkGrey,
  },
  trendUpGreen: {
    fontColor: colors.primaryBlack,
    pillIcon: assets.trendUpGreen,
    backgroundColor: colors.green,
  },
  trendDownGreen: {
    fontColor: colors.primaryBlack,
    pillIcon: assets.trendDownGreen,
    backgroundColor: colors.green,
  },
  trendUpRed: {
    fontColor: colors.white,
    pillIcon: assets.trendUpRed,
    backgroundColor: colors.red,
  },
  trendDownRed: {
    fontColor: colors.white,
    pillIcon: assets.trendDownRed,
    backgroundColor: colors.red,
  },
};
