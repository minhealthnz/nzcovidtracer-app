import { colors, grid } from "@constants";
import styled from "styled-components/native";

export const SearchListDivider = styled.View`
  height: ${grid}px;
  width: 100%;
  background-color: ${colors.lightGrey};
  border-bottom-width: 1px;
  border-color: ${colors.platinum};
`;
