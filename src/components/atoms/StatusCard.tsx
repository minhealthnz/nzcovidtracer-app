import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";
import { Tip, TipText } from "./Tip";

const Container = styled(TouchableOpacity)`
  flex-direction: row;
`;
const TextBox = styled(View)`
  flex: 1;
  flex-direction: column;
  padding: 12px ${grid2x}px ${grid2x}px ${grid2x}px;
  background-color: ${colors.white};
`;

const TopTextView = styled(View)`
  align-items: center;
  flex-direction: row;
`;

const Title = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryGray};
`;

export const StatusText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 18px;
  padding-top: 10px;
  padding-bottom: 3px;
`;

const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryGray};
`;

export const StatusViewContainer = styled.View<{ backgroundColor?: string }>`
  width: 90px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
`;

const Chevron = styled(Image)`
  margin-left: 5px;
  width: 8.5px;
  height: 14px;
`;

export const StatusView = styled(Image)`
  max-width: 100%;
  max-height: 100%;
`;

const assets = {
  chevron: require("@assets/icons/percentage-chevron-right.png"),
};

interface Props {
  onPress: () => void;
  title: string;
  renderStatusText?: React.ReactNode;
  description: string;
  tipText?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  renderStatusView?: React.ReactNode;
  statusImage?: ImageSourcePropType;
  statusText?: string;
  backgroundColor?: string;
}

export function StatusCard({
  onPress,
  title,
  statusText,
  description,
  tipText,
  accessibilityLabel,
  accessibilityHint,
  renderStatusView,
  statusImage,
  renderStatusText,
  backgroundColor,
}: Props) {
  return (
    <>
      <Container
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <TextBox>
          <TopTextView>
            <Title>{title}</Title>
            <Chevron source={assets.chevron} />
          </TopTextView>
          {renderStatusText ? (
            renderStatusText
          ) : (
            <StatusText>{statusText}</StatusText>
          )}
          <Description>{description}</Description>
        </TextBox>
        {statusImage ? (
          <StatusViewContainer backgroundColor={backgroundColor}>
            <StatusView source={statusImage} />
          </StatusViewContainer>
        ) : (
          renderStatusView
        )}
      </Container>
      {!!tipText && (
        <Tip backgroundColor={colors.paleYellow}>
          <TipText lineHeight={20} fontSize={14}>
            {tipText}
          </TipText>
        </Tip>
      )}
    </>
  );
}
