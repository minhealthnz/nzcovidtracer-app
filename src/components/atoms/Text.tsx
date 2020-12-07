import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import { TextProps } from "react-native";
import styled from "styled-components/native";

type FontFamily = keyof typeof fontFamilies;
type TextAlign = "center" | "left";

const BaseText = styled.Text<{
  color?: string;
  fontSize?: number;
  fontFamily?: FontFamily;
  textAlign?: TextAlign;
  lineHeight?: number;
}>`
  font-family: ${(props) =>
    props.fontFamily ? fontFamilies[props.fontFamily] : fontFamilies.baloo};
  font-size: ${(props) => props.fontSize ?? fontSizes.normal}px;
  color: ${(props) => (props.color != null ? props.color : colors.primaryBlack)}
    ${(props) => (props.textAlign ? `text-align: ${props.textAlign}` : "")}
    ${(props) => (props.lineHeight ? `line-height: ${props.lineHeight}px` : "")};
`;

interface Props extends TextProps {
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  fontFamily?: FontFamily;
  textAlign?: TextAlign;
  lineHeight?: number;
}

export const Text = (props: Props) => {
  const { color, ...rest } = props;

  return <BaseText color={color} {...rest} />;
};
