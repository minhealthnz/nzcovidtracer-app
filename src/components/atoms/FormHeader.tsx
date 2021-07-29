import { colors, grid3x } from "@constants";
import React from "react";
import {
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
} from "react-native";
import styled from "styled-components/native";

export interface FormHeaderProps {
  headerImageStyle?: ImageStyle;
  headerBanner?: ImageSourcePropType;
  headerImage?: ImageSourcePropType;
  headerBackgroundColor?: string;
  onHeightChanged?(height: number): void;
  accessibilityLabel?: string;
}

const HeaderImageContainer = styled.View<{ backgroundColor: string }>`
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${(props) => props.backgroundColor};
`;

const HeaderImage = styled.Image`
  margin-vertical: ${grid3x}px;
  width: 120px;
  height: 120px;
`;

const HeaderBannerContainer = styled.View`
  flex-direction: row;
`;

const HeaderBanner = styled.Image`
  height: 192px;
  flex: 1;
`;

const defaultHeaderBackgroundColor = colors.yellowConfirm;

export function FormHeader({
  headerBanner,
  headerImage,
  headerBackgroundColor,
  onHeightChanged,
  headerImageStyle,
  accessibilityLabel,
}: FormHeaderProps) {
  if (headerBanner != null) {
    return (
      <HeaderBannerContainer>
        <HeaderBanner source={headerBanner} />
      </HeaderBannerContainer>
    );
  }

  if (headerImage == null) {
    return null;
  }

  return (
    <HeaderImageContainer
      backgroundColor={headerBackgroundColor ?? defaultHeaderBackgroundColor}
      accessible={!!accessibilityLabel || false}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      onLayout={(event: LayoutChangeEvent) => {
        onHeightChanged?.(event.nativeEvent.layout.height);
      }}
    >
      <HeaderImage style={headerImageStyle} source={headerImage} />
    </HeaderImageContainer>
  );
}
