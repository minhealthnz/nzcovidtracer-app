import { colors } from "@constants";
import React, { ReactNode } from "react";
import styled from "styled-components/native";

import {
  cornerImageHeight,
  cornerImageWidth,
  paddingBottomVertical,
  paddingHorizontal,
  paddingTopVertical,
} from "./constants";

const TopRightCorner = styled.Image`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.6;
`;

const TopLeftCorner = styled.Image`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.6;
`;

const BottomLeftCorner = styled.Image`
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0.6;
`;

const BottomRightCorner = styled.Image`
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.6;
`;

const Left = styled.View<{ height: number }>`
  position: absolute;
  left: 0;
  bottom: 99px;
  width: 11px;
  background-color: ${colors.primaryBlack}
  height: ${(props) => props.height}px;
  opacity: 0.6;
`;

const Right = styled.View<{ height: number }>`
  position: absolute;
  right: 0;
  bottom: 99px;
  width: 11px;
  background-color: ${colors.primaryBlack}
  height: ${(props) => props.height}px;
  opacity: 0.6;
`;

const Bottom = styled.View<{ width: number }>`
  position: absolute;
  left: 100px;
  bottom: 0;
  width: ${(props) => props.width}px;
  height: 12px;
  background-color: ${colors.primaryBlack}
  opacity: 0.6;
`;

const Top = styled.View<{ width: number }>`
  position: absolute;
  left: 100px;
  top: 0;
  height: 51px;
  width: ${(props) => props.width}px;
  background-color: ${colors.primaryBlack}
  opacity: 0.6;
`;

const MaskInnerContainer = styled.View<{ width: number; height: number }>`
  position: absolute;
  top: 51px;
  left: 11px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 20px;
  justify-content: flex-end;
  overflow: hidden;
`;

interface Props {
  cameraWidth: number;
  cameraHeight: number;
  children: ReactNode;
}

const assets = {
  topLeft: require("@features/scan/assets/images/top-left.png"),
  topRight: require("@features/scan/assets/images/top-right.png"),
  bottomLeft: require("@features/scan/assets/images/bottom-left.png"),
  bottomRight: require("@features/scan/assets/images/bottom-right.png"),
};

export function MaskView({ cameraWidth, cameraHeight, children }: Props) {
  return (
    <>
      <Top width={cameraWidth - cornerImageWidth * 2} />
      <TopLeftCorner source={assets.topLeft} />
      <Left height={cameraHeight - (cornerImageWidth + cornerImageHeight)} />
      <BottomLeftCorner source={assets.bottomLeft} />
      <TopRightCorner source={assets.topRight} />
      <Right height={cameraHeight - (cornerImageWidth + cornerImageHeight)} />
      <BottomRightCorner source={assets.bottomRight} />
      <Bottom width={cameraWidth - cornerImageWidth * 2} />
      <MaskInnerContainer
        width={cameraWidth - paddingHorizontal * 2}
        height={cameraHeight - (paddingTopVertical + paddingBottomVertical)}
      >
        {children}
      </MaskInnerContainer>
    </>
  );
}
