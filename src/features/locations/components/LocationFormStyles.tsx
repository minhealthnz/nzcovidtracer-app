import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  padding-bottom: 18px;
`;

export const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const Subtitle = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  color: ${colors.primaryBlack};
  font-size: ${fontSizes.normal}px;
  line-height: 18px;
`;

export const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryBlack};
  line-height: 24px;
  padding-top: ${grid}px;
`;

export const ImageContainer = styled.View`
  margin-right: ${grid2x}px;
  margin-top: -5px;
  width: 40px;
  height: 40px;
`;
