import { Text } from "@components/atoms";
import { fontSizes, grid2x } from "@constants";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

export interface MoreProps {
  text: string;
  onPress(): void;
  isOpen?: boolean;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-left: 2px;
  padding-bottom: ${grid2x}px;
`;

const Icon = styled.View<{ isOpen: boolean | undefined }>`
  transform: rotate(${(props) => (props.isOpen ? "90deg" : "0deg")});
`;

const Padding = styled.View`
  padding-left: 12px;
`;

export default function More({ text, onPress, isOpen }: MoreProps) {
  return (
    <Container onPress={onPress}>
      <Icon isOpen={isOpen}>
        <Image source={require("@assets/images/drop-right.png")} />
      </Icon>
      <Padding>
        <Text fontSize={fontSizes.normal} fontFamily="open-sans-semi-bold">
          {text}
        </Text>
      </Padding>
    </Container>
  );
}
