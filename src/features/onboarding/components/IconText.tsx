import { Text as BaseText } from "@components/atoms";
import { fontFamilies, grid3x } from "@constants";
import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

export interface IconTextProps {
  text: string;
  source: ImageSourcePropType;
  paddingBottom?: number;
}

const Container = styled.View<{ paddingBottom?: number }>`
  flex-direction: row;
  align-items: center;
  padding-bottom: ${(props) => props.paddingBottom ?? grid3x}px;
`;

const Text = styled(BaseText)`
  font-size: 16px;
  line-height: 24px;
  font-family: ${fontFamilies["open-sans"]};
  padding-left: 14px;
  flex: 1;
`;

export function IconText({ text, source, paddingBottom }: IconTextProps) {
  return (
    <Container paddingBottom={paddingBottom}>
      <Image source={source} width={40} height={40} />
      <Text>{text}</Text>
    </Container>
  );
}
