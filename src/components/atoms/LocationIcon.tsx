import { DiaryEntryType } from "@features/diary/types";
import React from "react";
import styled from "styled-components/native";

const assets = {
  manual: require("@assets/icons/location-manual-entry.png"),
  poster: require("@assets/icons/location-poster-entry.png"),
  saved: require("@assets/icons/saved-location-small.png"),
};

export const IconView = styled.View`
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
`;

const Icon = styled.Image<{ alignLeft?: boolean }>`
  width: 46px;
  height: 46px;
  margin-left: ${(props) => (props.alignLeft ? -20 : 0)}px;
`;

const SavedIcon = styled.Image<{ alignLeft?: boolean }>`
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0;
  right: ${(props) => (props.alignLeft ? 10 : 1)}px;
`;

export interface LocationIconProps {
  locationType: DiaryEntryType;
  isFavourite: boolean;
  alignLeft?: boolean;
}

export function LocationIcon(props: LocationIconProps) {
  const { isFavourite, locationType, alignLeft } = props;
  return (
    <IconView>
      <Icon
        source={locationType === "manual" ? assets.manual : assets.poster}
        alignLeft={alignLeft}
      />
      {isFavourite && <SavedIcon source={assets.saved} alignLeft={alignLeft} />}
    </IconView>
  );
}
