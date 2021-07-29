import { Button, Text } from "@components/atoms";
import { Image } from "@components/atoms/Image";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const ButtonContainer = styled.View`
  padding-horizontal: ${grid2x}px;
`;

const ButtonTitle = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryBlack};
`;

const ButtonDescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${grid}px;
  justify-content: flex-start;
`;

const ButtonDescription = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  color: ${colors.primaryBlack};
  flex: 1;
`;

const ImageContainer = styled.View`
  margin-right: ${grid2x}px;
  margin-vertical: ${grid}px;
  align-self: center;
  margin-left: -10px;
`;

const assets = {
  manualEntry: require("@assets/icons/location-manual-entry.png"),
  poster: require("@assets/icons/location-poster-entry.png"),
};

export interface LocationSaveButtonsProps {
  diaryEntry?: DiaryEntry;
  onSavePress: () => void;
}

export function LocationSaveButtons(props: LocationSaveButtonsProps) {
  const { t } = useTranslation();
  const { diaryEntry, onSavePress } = props;

  if (!diaryEntry) {
    return (
      <Button
        text={t("screens:saveLocationOnboarding:saveNew")}
        onPress={onSavePress}
      />
    );
  }
  return (
    <ButtonContainer>
      <ButtonTitle>
        {t("screens:saveLocationOnboarding:buttonTitle")}
      </ButtonTitle>
      <ButtonDescriptionContainer>
        <ImageContainer
          accessibilityLabel={
            diaryEntry.type === "manual"
              ? t(
                  "screens:saveLocationOnboarding:manualDiaryImageAccessibilityLabel",
                )
              : t(
                  "screens:saveLocationOnboarding:manualDiaryImageAccessibilityLabel",
                )
          }
          accessibilityRole="image"
        >
          <Image
            source={
              diaryEntry.type === "manual" ? assets.manualEntry : assets.poster
            }
            width={50}
            height={50}
          />
        </ImageContainer>
        <ButtonDescription>{diaryEntry.name}</ButtonDescription>
      </ButtonDescriptionContainer>
      <Button
        text={t("screens:saveLocationOnboarding:save")}
        onPress={onSavePress}
      />
    </ButtonContainer>
  );
}
