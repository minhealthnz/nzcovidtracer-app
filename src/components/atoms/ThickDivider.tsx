import { colors } from "@constants";
import styled from "styled-components/native";

export const ThickDivider = styled.View`
  height: 9px;
  background-color: ${colors.white};
  margin: 0 -20px 15px;
  border-left-width: 0px;
  border-right-width: 0px;
  border: 1px solid ${colors.platinum};
`;
