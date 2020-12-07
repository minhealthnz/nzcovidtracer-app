import { colors } from "@constants";
import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

const Line = styled.View`
  background-color: ${colors.divider};
  width: 100%;
  height: 1px;
`;

export interface DividerProps {
  style?: ViewStyle;
}

export default function Divider({ style }: DividerProps) {
  return <Line style={style} />;
}
