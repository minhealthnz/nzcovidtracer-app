import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

import { RemoteImage } from "./RemoteImage";

const BaseImage = styled.Image<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

export interface ImageProps {
  /**
   * source of the image. Pass string to fetch from a url
   */
  source: ImageSourcePropType | string;
  width: number;
  height: number;
}

export function Image({ source, width, height }: ImageProps) {
  return typeof source === "string" ? (
    <RemoteImage source={source} width={width} height={height} />
  ) : (
    <BaseImage
      source={source}
      width={width}
      height={height}
      resizeMode="contain"
    />
  );
}
