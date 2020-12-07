import { Text as BaseText } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${colors.toastRed};
  padding: ${grid}px ${grid2x}px;
  border-bottom-width: 3px;
  border-color: ${colors.darkRed};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
`;

const Text = styled(BaseText)`
  color: ${colors.white};
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
`;

export interface ToastProps {
  text: string;
}

export function Toast({ text }: ToastProps) {
  const toastRef = useRef(null);

  useEffect(() => {
    const reactTag = findNodeHandle(toastRef.current);
    if (reactTag && text.trim().length > 0) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }, [toastRef, text]);

  return (
    <Container ref={toastRef} accessible accessibilityLabel={`Error ${text}`}>
      <Text>{text}</Text>
    </Container>
  );
}
