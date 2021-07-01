import { colors, fontFamilies, fontSizes, grid, grid3x } from "@constants";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

import { Text } from "../atoms/Text";

const DisclaimerText = styled(Text)`
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryGray};
  text-align: center;
`;

const DisclaimerView = styled.View`
  background-color: ${colors.platinum};
  padding: ${grid}px ${grid3x}px 21px;
  align-items: center;
`;

const assets = {
  lock: require("@assets/icons/lock.png"),
};

export interface DisclaimerProps {
  text: string;
}

export function Disclaimer({ text }: DisclaimerProps) {
  return (
    <DisclaimerView>
      <Image source={assets.lock} />
      <DisclaimerText maxFontSizeMultiplier={1.5}>{text}</DisclaimerText>
    </DisclaimerView>
  );
}
