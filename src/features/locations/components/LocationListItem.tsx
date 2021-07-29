import { LocationIcon, Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import pupa from "pupa";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";

import { useLocation } from "../hooks/useLocation";
import { useLocationAccessibility } from "../hooks/useLocationAccessibility";
import { Location } from "../types";

const assets = {
  delete: require("../assets/icons/delete.png"),
  saveButton: require("../assets/icons/star-button-small.png"),
  saveButtonActive: require("../assets/icons/star-button-small-active.png"),
};

const MainView = styled.View`
  background-color: ${colors.white};
  padding-horizontal: ${grid2x}px;
  padding-vertical: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ListItemView = styled.TouchableOpacity`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const TextView = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-right: ${grid}px;
  padding-left: 2px;
  flex: 1;
`;

export const Name = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  color: ${colors.primaryBlack};
`;

const Address = styled(Text)`
  font-size: ${fontSizes.small}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${colors.primaryGray};
  line-height: 16px;
`;

const DeleteIcon = styled.Image`
  width: 32px;
  height: 32px;
`;

export interface LocationListItemProps {
  onLocationPress?: (locationId: string | Location) => void;
  rightButton?: "save" | "delete";
  location: Location;
  onPressRightButton?: () => void;
  index?: number;
  totalNumberOfLocations?: number;
  accessibilityHint?: string;
  alignLocationIconLeft?: boolean;
}

export function LocationListItem(props: LocationListItemProps) {
  const {
    rightButton,
    location,
    onPressRightButton,
    onLocationPress,
    index,
    totalNumberOfLocations,
    accessibilityHint,
    alignLocationIconLeft,
  } = props;
  const { address, isFavourite, name, type, id } = location;

  const { t } = useTranslation();

  const locations = useLocation(id) || name;

  const { locationIconAccessibilityLabel } = useLocationAccessibility({
    isFavourite: isFavourite,
    locationType: type,
  });

  const accessibilityLabel = useMemo(() => {
    if (type === "manual") {
      return pupa(t("components:locationListItem:accessibility:manualEntry"), [
        locationIconAccessibilityLabel,
        name,
        index,
        totalNumberOfLocations,
      ]);
    } else {
      return pupa(
        t("components:locationListItem:accessibility:scannedLocation"),
        [
          locationIconAccessibilityLabel,
          name,
          address,
          index,
          totalNumberOfLocations,
        ],
      );
    }
  }, [
    locationIconAccessibilityLabel,
    name,
    address,
    index,
    totalNumberOfLocations,
    t,
    type,
  ]);

  const renderButton = useMemo(() => {
    switch (rightButton) {
      case "delete":
        return (
          <TouchableOpacity
            onPress={onPressRightButton}
            accessibilityLabel={t(
              "components:locationListItem:accessibility:delete",
            )}
            accessibilityRole="button"
          >
            <DeleteIcon source={assets.delete} />
          </TouchableOpacity>
        );
      case "save":
      default:
        return (
          <TouchableOpacity
            onPress={onPressRightButton}
            accessibilityLabel={t(
              "components:locationListItem:accessibility:save",
            )}
            accessibilityRole="button"
          >
            <DeleteIcon
              source={isFavourite ? assets.saveButtonActive : assets.saveButton}
            />
          </TouchableOpacity>
        );
    }
  }, [isFavourite, onPressRightButton, rightButton, t]);

  const handleOnPress = useCallback(() => {
    if (onLocationPress == null) {
      return;
    }

    onLocationPress(locations);
  }, [onLocationPress, locations]);

  return (
    <MainView>
      <ListItemView
        onPress={onLocationPress ? handleOnPress : undefined}
        disabled={!!rightButton}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={
          accessibilityHint ||
          t("components:locationListItem:accessibility:hint")
        }
      >
        <LocationIcon
          isFavourite={isFavourite}
          locationType={type}
          alignLeft={alignLocationIconLeft}
        />
        <TextView>
          <Name numberOfLines={1}>{name}</Name>
          {!!address && <Address numberOfLines={1}>{address}</Address>}
        </TextView>
      </ListItemView>
      {onPressRightButton && renderButton}
    </MainView>
  );
}
