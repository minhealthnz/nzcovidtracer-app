import { Text } from "@components/atoms";
import { fontFamilies, fontSizes, grid } from "@constants";
import styled from "styled-components/native";

export const Subtext = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  margin-top: ${grid}px;
`;
