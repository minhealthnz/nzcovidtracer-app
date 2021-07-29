import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  padding: 0px 4px;
`;

const Badge = styled.Image`
  position: absolute;
  right: 0;
  top: 4px;
`;

interface TabBarIconProps {
  source: ImageSourcePropType;
  routeName: string;
  badgeType?: "important" | "normal";
}

const assets = {
  redBadge: require("@assets/icons/red-dot.png"),
  yellowBadge: require("@assets/icons/yellow-dot.png"),
};

export function TabBarIcon({ source, badgeType }: TabBarIconProps) {
  return (
    <Container>
      <Image accessible={false} source={source} />
      {badgeType === "important" ? (
        <Badge accessible={false} source={assets.redBadge} />
      ) : badgeType === "normal" ? (
        <Badge accessible={false} source={assets.yellowBadge} />
      ) : null}
    </Container>
  );
}
