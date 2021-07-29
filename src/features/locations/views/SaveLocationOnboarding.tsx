import { Image } from "@components/atoms/Image";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { selectHasDiaryEntries } from "@features/diary/selectors";
import { addFavourite } from "@features/locations/actions/addFavourite";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";

import {
  Container,
  Description,
  ImageContainer,
  Subtitle,
  TextContainer,
} from "../components/LocationFormStyles";
import { LocationSaveButtons } from "../components/LocationSaveButtons";
import { setHasSeenLocationOnboarding } from "../reducer";
import { LocationScreen } from "../screens";

const assets = {
  headerImage: require("@features/locations/assets/images/favourite-location.png"),
  scan: require("@assets/icons/scan.png"),
  manualEntry: require("@assets/icons/manual-entry.png"),
};

export interface SaveLocationOnboardingProps
  extends StackScreenProps<
    MainStackParamList,
    LocationScreen.SaveLocationOnboarding
  > {}

export function SaveLocationOnboarding(props: SaveLocationOnboardingProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { diaryEntry, hasSeenLocationOnboarding } = props.route.params;

  const hasDiaryEntries = useSelector(selectHasDiaryEntries);

  useEffect(() => {
    if (hasSeenLocationOnboarding === false) {
      dispatch(setHasSeenLocationOnboarding());
    }
  }, [dispatch, hasSeenLocationOnboarding]);

  const onSavePress = useCallback(() => {
    if (!diaryEntry) {
      props.navigation.replace(
        hasDiaryEntries
          ? LocationScreen.SaveNewLocation
          : LocationScreen.SaveNewLocationEmpty,
      );
      return;
    }
    dispatch(
      addFavourite({
        locationId: diaryEntry.locationId,
      }),
    );
    props.navigation.goBack();
  }, [dispatch, diaryEntry, props.navigation, hasDiaryEntries]);

  const onCancelPress = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  const renderButton = useCallback(() => {
    return (
      <LocationSaveButtons diaryEntry={diaryEntry} onSavePress={onSavePress} />
    );
  }, [diaryEntry, onSavePress]);

  const [fontScale, setFontScale] = useState(1);
  useFocusEffect(() => {
    DeviceInfo.getFontScale().then((scale) => setFontScale(scale));
  });

  return (
    <FormV2
      headerBackgroundColor={colors.lightYellow}
      headerImage={assets.headerImage}
      snapButtonsToBottom={!!diaryEntry && fontScale <= 1}
      renderButton={renderButton}
      secondaryButtonText={
        diaryEntry && t("screens:saveLocationOnboarding:cancel")
      }
      onSecondaryButtonPress={diaryEntry && onCancelPress}
    >
      <Container>
        <ImageContainer
          accessibilityLabel={t(
            "screens:saveLocationOnboarding:scannedLocationImageAccessibilityLabel",
          )}
          accessibilityRole="image"
        >
          <Image source={assets.scan} width={40} height={40} />
        </ImageContainer>
        <TextContainer>
          <Subtitle>{t("screens:saveLocationOnboarding:subtitle")}</Subtitle>
          <Description>
            {t("screens:saveLocationOnboarding:description1")}
          </Description>
          <Description>
            {t("screens:saveLocationOnboarding:description2")}
          </Description>
        </TextContainer>
      </Container>
      <Container>
        <ImageContainer
          accessibilityLabel={t(
            "screens:saveLocationOnboarding:manualDiaryImageAccessibilityLabel",
          )}
          accessibilityRole="image"
        >
          <Image source={assets.manualEntry} width={40} height={40} />
        </ImageContainer>
        <TextContainer>
          <Subtitle>
            {t("screens:saveLocationOnboarding:secondSubtitle")}
          </Subtitle>
          <Description>
            {t("screens:saveLocationOnboarding:secondDescription")}
          </Description>
        </TextContainer>
      </Container>
      <Tip backgroundColor={colors.lightRed} leftBorderColor={colors.failure}>
        <TipText>{t("screens:saveLocationOnboarding:tip")}</TipText>
      </Tip>
    </FormV2>
  );
}
