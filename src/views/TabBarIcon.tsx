import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  padding: 0px 4px;
`;

const RedDot = styled.Image`
  position: absolute;
  right: 0;
  top: 2px;
`;

interface TabBarIconProps {
  source: ImageSourcePropType;
  routeName: string;
  showBadge?: boolean;
}

export function TabBarIcon({ source, showBadge: hasAlert }: TabBarIconProps) {
  return (
    <Container>
      <Image accessible={false} source={source} />
      {hasAlert && (
        <RedDot
          accessible={false}
          source={require("@assets/icons/red-dot.png")}
        />
      )}
    </Container>
  );
}
