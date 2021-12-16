import { Text as BaseText } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import React, { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";
import styled from "styled-components/native";

const Container = styled.View<{ backgroundColor?: string }>`
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.toastRed};
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
`;

const BottomBorder = styled.View`
  background-color: ${colors.primaryBlack};
  height: 4px;
  width: 100%;
  opacity: 0.3;
`;

const Text = styled(BaseText)<{ fontColor?: string }>`
  color: ${(props) => (props.fontColor ? props.fontColor : colors.white)};
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  padding: ${grid}px ${grid2x}px;
`;

export interface ToastProps {
  text: string;
  backgroundColor?: string;
  fontColor?: string;
  setToastHeight?: (height: number) => void;
}

export function Toast({
  text,
  backgroundColor,
  fontColor,
  setToastHeight,
}: ToastProps) {
  const toastRef = useRef<any>(null);

  useEffect(() => {
    const reactTag = findNodeHandle(toastRef.current);
    if (reactTag && text.trim().length > 0) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }, [toastRef, text]);

  return (
    <Container
      ref={toastRef}
      onLayout={(event) => {
        setToastHeight && setToastHeight(event.nativeEvent.layout.height);
      }}
      backgroundColor={backgroundColor}
      accessible
      accessibilityLabel={`${text}`}
    >
      <Text fontColor={fontColor}>{text}</Text>
      <BottomBorder />
    </Container>
  );
}
