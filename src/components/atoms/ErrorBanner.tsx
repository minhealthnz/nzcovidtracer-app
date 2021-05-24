import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

import { Text } from "./Text";

interface ErrorBannerProps {
  icon: ImageSourcePropType;
  title: string;
  body: string;
}

const Container = styled.View`
  flex-direction: row;
  background: ${colors.lightPink};
  padding: 18px 20px 14px 20px;
`;

const Icon = styled.Image`
  width: 40px;
  height: 40px;
`;

const Title = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 20px;
`;

const Body = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans"]};
  line-height: 20px;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-left: 14px;
`;

export function ErrorBanner({ title, body, icon }: ErrorBannerProps) {
  return (
    <Container>
      <Icon source={icon} />
      <TextContainer>
        <Title>{title}</Title>
        <Body>{body}</Body>
      </TextContainer>
    </Container>
  );
}
