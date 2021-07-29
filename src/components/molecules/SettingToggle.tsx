import { Text, Toggle } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import styled from "styled-components/native";

const MainView = styled.View`
  width: 100%;
  flex-direction: row;
  padding-vertical: ${grid2x}px;
`;

const TextView = styled.View`
  flex-direction: column;
  flex: 1;
  padding-right: 5px;
`;

// If loading, slow text and description as disabled grey
const Title = styled(Text)<{ isLoading?: boolean }>`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 18px;
  padding-top: 2px;
  margin-bottom: -2px;
  color: ${(props) =>
    props.isLoading ? colors.fadedGrey : colors.primaryBlack};
`;

const Description = styled(Text)<{ isLoading?: boolean }>`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  color: ${(props) =>
    props.isLoading ? colors.fadedGrey : colors.primaryBlack};
`;

const ToggleView = styled.View`
  justify-content: center;
  align-items: flex-end;
`;

interface SettingToggleProps {
  value?: boolean;
  onPress?: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function SettingToggle(props: SettingToggleProps) {
  return (
    <TouchableWithoutFeedback
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: !!props.value }}
      onPress={props.onPress}
    >
      <MainView>
        <TextView>
          <Title isLoading={props.isLoading}>{props.title}</Title>
          <Description isLoading={props.isLoading}>
            {props.description}
          </Description>
        </TextView>
        {props.onPress && props.value !== undefined && (
          <ToggleView pointerEvents="none">
            <Toggle value={props.value} isLoading={props.isLoading} />
          </ToggleView>
        )}
      </MainView>
    </TouchableWithoutFeedback>
  );
}
