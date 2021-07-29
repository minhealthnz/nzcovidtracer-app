import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";

import { Text } from "./Text";
import { VerticalSpacing } from "./VerticalSpacing";

const Container = styled(View)<{
  backgroundColor: string;
  leftBorderColor?: string;
}>`
  background-color: ${(props) => props.backgroundColor};
  border-left-width: 4px;
  border-color: ${(props) =>
    props.leftBorderColor ? props.leftBorderColor : colors.yellow};
  padding: 11px 15px 9px 16px;
`;

export const TipSubHeading = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  line-height: 20px;
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryBlack};
`;

const Context = styled(Text)<{ fontSize?: number; lineHeight?: number }>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : 16)}px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryBlack};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : 24)}px;
`;

const Heading = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

interface TextProps {
  fontSize?: number;
  children: React.ReactNode;
  lineHeight?: number;
}

interface Props {
  children: Element;
  backgroundColor: string;
  heading?: string;
  leftBorderColor?: string;
}

export function Tip({
  children,
  backgroundColor,
  heading,
  leftBorderColor,
}: Props) {
  return (
    <>
      {!!heading && (
        <>
          <Heading>{heading}</Heading>
          <VerticalSpacing height={5} />
        </>
      )}
      <Container
        backgroundColor={backgroundColor}
        leftBorderColor={leftBorderColor}
      >
        {children}
      </Container>
    </>
  );
}

export function TipText(props: TextProps) {
  return (
    <Context fontSize={props.fontSize} lineHeight={props.lineHeight}>
      {props.children}
    </Context>
  );
}

export const presets = {
  warning: {
    leftBorderColor: colors.orange,
    backgroundColor: colors.paleOrange,
  },
};
