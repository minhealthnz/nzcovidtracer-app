import { colors, fontFamilies } from "@constants";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";

import { Text } from "./Text";

const Container = styled(View)<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  border-left-width: 4px;
  border-color: ${colors.yellow};
  padding: 11px 15px 9px 16px;
`;

const Context = styled(Text)<{ fontSize?: number; lineHeight?: number }>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : 16)}px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryBlack};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : 24)}px;
`;

interface TextProps {
  fontSize?: number;
  children: React.ReactNode;
  lineHeight?: number;
}

interface Props {
  children: Element;
  backgroundColor: string;
}

export function Tip({ children, backgroundColor }: Props) {
  return <Container backgroundColor={backgroundColor}>{children}</Container>;
}

export function TipText(props: TextProps) {
  return (
    <Context fontSize={props.fontSize} lineHeight={props.lineHeight}>
      {props.children}
    </Context>
  );
}
