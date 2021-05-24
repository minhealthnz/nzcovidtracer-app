import { AssetFilterContext } from "@components/molecules/AssetFilter";
import { checkHostWhitelist } from "@utils/checkHostWhitelist";
import { useContext, useState } from "react";
import React from "react";
import { PixelRatio } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";

const RemoteIcon = styled(FastImage)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const PlaceholderIcon = styled.Image<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: absolute;
  top: 0;
  left: 0;
`;

export interface RemoteImageProps {
  source: string;
  width: number;
  height: number;
}

export function RemoteImage({ source, width, height }: RemoteImageProps) {
  const [iconLoaded, setIconLoaded] = useState(false);

  const { assetWhitelist } = useContext(AssetFilterContext);

  const valid = checkHostWhitelist(source, assetWhitelist);
  const showPlaceholder = !iconLoaded || !valid;

  return (
    <>
      {showPlaceholder && (
        <PlaceholderIcon
          width={width}
          height={height}
          source={require("@features/dashboard/assets/icons/information.png")}
        />
      )}
      <RemoteIcon
        width={width}
        height={height}
        source={{
          uri: valid ? getScaledAssetUrl(source) : undefined,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
        onLoad={() => setIconLoaded(true)}
      />
    </>
  );
}

function getScaledAssetUrl(url: string) {
  const fileExtensionIndex = url.indexOf(".png");
  if (fileExtensionIndex < 0) {
    return url;
  }
  const newUrl = url.slice(0, fileExtensionIndex);
  const scaleFactor = PixelRatio.get();
  if (scaleFactor > 2) {
    return `${newUrl}@3x.png`;
  }
  if (scaleFactor > 1) {
    return `${newUrl}@2x.png`;
  }
  return url;
}
