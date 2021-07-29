import MaskedView from "@react-native-community/masked-view";
import React from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

import { itemHeight, itemWidth, maskMargin, topMargin } from "./constants";

const MaskElement = styled(Animated.View)`
  flex: 1;
  background-color: white;
  position: absolute;
  top: ${topMargin + maskMargin}px;
  width: ${itemWidth - 2 * maskMargin}px;
  height: ${itemHeight - 2 * maskMargin}px;
  border-radius: 4px;
`;

export interface MaskProps {
  left: Animated.AnimatedInterpolation;
  children: React.ReactNode;
}

export function Mask({ left, children }: MaskProps) {
  const maskElement = (
    <MaskElement
      style={{
        left,
      }}
    />
  );

  return <MaskedView maskElement={maskElement}>{children}</MaskedView>;
}
