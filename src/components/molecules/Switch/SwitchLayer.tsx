import { Text } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import styled from "styled-components/native";

import { itemHeight, topMargin } from "./constants";

const Container = styled.View<{ height: number }>`
  flex-direction: row;
  height: ${(props) => props.height}px;
`;

const Background = styled.View<{
  backgroundColor: string;
  top: number;
  height: number;
}>`
  position: absolute;
  background-color: ${(props) => props.backgroundColor};
  height: ${(props) => props.height}px;
  border-radius: 4px;
  left: 0;
  right: 0;
  top: ${(props) => props.top}px;
  bottom: ${(props) => props.top}px;
`;

const Label = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  padding-top: 8px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  height: 100%;
  min-width: 90px;
  align-items: center;
  justify-content: center;
`;

interface SwitchLayerProps {
  titles: string[];
  isOverlay?: boolean;
  onPress?(index: number): void;
}

export function SwitchLayer({ titles, isOverlay, onPress }: SwitchLayerProps) {
  return (
    <Container height={itemHeight + topMargin * 2}>
      <Background
        height={itemHeight}
        top={topMargin}
        backgroundColor={isOverlay ? colors.primaryBlack : colors.lightYellow}
      />
      {titles.map((title, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onPress?.(index);
          }}
          activeOpacity={0.6}
        >
          <Label
            color={isOverlay ? colors.yellow : colors.primaryBlack}
            allowFontScaling={false}
          >
            {title}
          </Label>
        </TouchableOpacity>
      ))}
    </Container>
  );
}
