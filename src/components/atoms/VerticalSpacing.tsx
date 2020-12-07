import React from "react";
import styled from "styled-components/native";

const DEFAULT_SPACING_HEIGHT = 8;

const Spacing = styled.View<{ height?: number }>`
  height: ${(props) => props.height ?? DEFAULT_SPACING_HEIGHT}px;
`;

interface Props {
  height?: number;
}
export function VerticalSpacing(props: Props) {
  return <Spacing height={props.height} />;
}
