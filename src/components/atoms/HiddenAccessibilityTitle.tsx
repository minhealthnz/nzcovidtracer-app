import React from "react";
import styled from "styled-components/native";

const HiddenView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
`;

export interface HiddenAccessibilityTitleProps {
  label: string;
}

export function HiddenAccessibilityTitle({
  label: text,
}: HiddenAccessibilityTitleProps) {
  return (
    <HiddenView
      accessible={true}
      accessibilityLabel={text}
      pointerEvents="none"
    />
  );
}
