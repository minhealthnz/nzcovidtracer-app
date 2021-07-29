import { colors } from "@constants";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const ButtonContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primaryBlack};
`;

const SaveLocationImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export const SaveLocationContainer = styled.View`
  margin-left: auto;
  padding-top: 8px;
`;

const assets = {
  locationSaved: require("@features/locations/assets/icons/saved-location.png"),
  locationUnSaved: require("@features/locations/assets/icons/unsaved-location.png"),
};

export interface SaveLocationButtonProps {
  saved: boolean;
  onPress(): void;
}

export function SaveLocationButton({
  saved,
  onPress,
}: SaveLocationButtonProps) {
  const { t } = useTranslation();

  const accessibilityLabel = useMemo(() => {
    return saved
      ? t("components:saveLocationButton:saved")
      : t("components:saveLocationButton:unSaved");
  }, [saved, t]);

  return (
    <ButtonContainer
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityLiveRegion="polite"
    >
      <SaveLocationImage
        source={saved ? assets.locationSaved : assets.locationUnSaved}
      />
    </ButtonContainer>
  );
}
