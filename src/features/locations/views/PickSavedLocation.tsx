import { FocusAwareStatusBar } from "@components/atoms/FocusAwareStatusBar";
import { Image } from "@components/atoms/Image";
import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { commonStyles } from "@lib/commonStyles";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  Description,
  ImageContainer,
  Subtitle,
  TextContainer,
} from "../components/LocationFormStyles";
import { LocationList } from "../components/LocationList";
import { useLocations } from "../hooks/useLocations";
import { LocationScreen } from "../screens";
import { Location } from "../types";

interface Props
  extends StackScreenProps<
    MainStackParamList,
    LocationScreen.PlaceOrActivity
  > {}

const assets = {
  headerImage: require("@features/locations/assets/images/light-grey-favourite-location.png"),
  scan: require("@assets/icons/scan.png"),
  manualEntry: require("@assets/icons/manual-entry.png"),
};

export function PickSavedLocation(props: Props) {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [props.navigation]);

  const { t } = useTranslation();

  const { locations } = useLocations({ isFavourite: true });

  const onPress = useCallback(
    (location: Location | string) => {
      props.navigation.navigate(DiaryScreen.AddEntryManually, {
        location: location,
      });
    },
    [props.navigation],
  );

  return (
    <>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        divider={true}
      />
      {locations.length === 0 ? (
        <FormV2
          headerBackgroundColor={colors.lightGrey}
          heading={t("screens:pickSavedLocation:heading")}
          headerImage={assets.headerImage}
          headingStyle={commonStyles.paddingBottom_grid2x}
        >
          <Container>
            <ImageContainer accessible={false}>
              <Image source={assets.scan} width={40} height={40} />
            </ImageContainer>
            <TextContainer>
              <Subtitle>{t("screens:pickSavedLocation:subtitle")}</Subtitle>
              <Description>
                {t("screens:pickSavedLocation:description")}
              </Description>
              <Description>
                {t("screens:pickSavedLocation:description2")}
              </Description>
            </TextContainer>
          </Container>
          <Container>
            <ImageContainer accessible={false}>
              <Image source={assets.manualEntry} width={40} height={40} />
            </ImageContainer>
            <TextContainer>
              <Subtitle>
                {t("screens:pickSavedLocation:secondSubtitle")}
              </Subtitle>
              <Description>
                {t("screens:pickSavedLocation:secondDescription")}
              </Description>
            </TextContainer>
          </Container>
        </FormV2>
      ) : (
        <LocationList
          sortBy="name"
          onLocationPress={onPress}
          isFavourite={true}
        />
      )}
    </>
  );
}
