import { Text } from "@components/atoms";
import { CloseButton } from "@components/atoms/CloseButton";
import { Image } from "@components/atoms/Image";
import { colors, fontSizes, grid, grid2x } from "@constants";
import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

const Container = styled.View<{ backgroundColor?: string; hasIcon: boolean }>`
  background-color: ${(props) => props.backgroundColor || colors.lightYellow};
  padding: ${grid2x}px ${(props) => (props.hasIcon ? grid2x : grid)}px;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TextView = styled.View`
  flex-direction: column;
  padding-right: ${grid}px;
  padding-left: 14px;
  flex: 1;
  margin-vertical: ${grid}px;
`;

const Title = styled(Text)`
  line-height: 20px;
  margin-right: ${grid2x}px;
`;

const Description = styled(Text)`
  line-height: 20px;
`;

const ImageContainer = styled.View`
  margin-top: ${grid}px;
`;

interface Props {
  icon?: ImageSourcePropType | string;
  heading: string;
  body: string;
  backgroundColor?: string;
  onDismiss?(): void;
}

export default function InfoBlock({
  icon,
  heading,
  body,
  backgroundColor,
  onDismiss,
}: Props) {
  return (
    <Container backgroundColor={backgroundColor} hasIcon={!!icon}>
      {onDismiss && <CloseButton onDismiss={onDismiss} />}
      {!!icon && (
        <ImageContainer>
          <Image source={icon} width={40} height={40} />
        </ImageContainer>
      )}
      <TextView>
        <Title
          textAlign="left"
          fontSize={fontSizes.normal}
          fontFamily="baloo-semi-bold"
        >
          {heading}
        </Title>

        <Description
          fontFamily="open-sans"
          fontSize={fontSizes.small}
          textAlign="left"
        >
          {body}
        </Description>
      </TextView>
    </Container>
  );
}
