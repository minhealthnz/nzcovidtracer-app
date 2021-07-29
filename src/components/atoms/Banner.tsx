import { fontFamilies, fontSizes, grid, grid3x } from "@constants";
import styled from "styled-components/native";

import { Text } from "./Text";

export const Banner = styled.View<{
  color?: string;
  paddingHorizontal?: number;
}>`
  width: 100%;
  background-color: ${(props) => props.color};
  padding-horizontal: ${(props) =>
    props.paddingHorizontal ? props.paddingHorizontal : grid3x}px;
  padding-vertical: ${grid}px;
  flex-direction: row;
  align-items: center;
`;

export const BannerText = styled(Text)<{ color?: string }>`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  margin-left: ${grid}px;
  color: ${(props) => props.color};
`;
