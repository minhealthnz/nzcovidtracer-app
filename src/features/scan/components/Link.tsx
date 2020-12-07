import { Text as BaseText } from "@components/atoms/Text";
import { fontFamilies, fontSizes } from "@constants";
import React from "react";
import styled from "styled-components/native";

export interface LinkProps {
  text: string;
  onPress(): void;
}

const Text = styled(BaseText)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.small}px;
  text-decoration-line: underline;
  padding: 0 0 24px 0;
`;

export function Link({ text, onPress }: LinkProps) {
  return <Text onPress={onPress}>{text}</Text>;
}
