import { LocationIcon, VerticalSpacing } from "@components/atoms";
import { FocusAwareStatusBar } from "@components/atoms/FocusAwareStatusBar";
import { IconView } from "@components/atoms/LocationIcon";
import { SearchBar } from "@components/atoms/SearchBar";
import { colors, grid, grid2x } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { LocationList } from "@features/locations/components/LocationList";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { Name } from "../components/LocationListItem";
import { useLocations } from "../hooks/useLocations";
import { LocationScreen } from "../screens";
import { Location } from "../types";

const DefaultLocationView = styled.View`
  flex-direction: row;
  background-color: ${colors.white};
  padding-vertical: ${grid}px;
  padding-horizontal: ${grid2x}px;
  border-top-width: 1px;
  border-color: ${colors.platinum};
`;

const IStayedHome = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  flex: 1;
  border-right-width: 1px;
  border-color: ${colors.platinum};
`;

const ViewSaved = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  flex: 1;
  margin-left: 5px;
`;

const Icon = styled.Image`
  width: 28px;
  height: 28px;
`;

const Chevron = styled.Image`
  margin-left: auto;
`;

const ButtonText = styled(Name)`
  flex: 1;
`;

const assets = {
  favouriteLocation: require("@features/locations/assets/icons/yellow-star-favourite.png"),
  chevron: require("@assets/icons/chevron-right.png"),
};

interface Props
  extends StackScreenProps<
    MainStackParamList,
    LocationScreen.PlaceOrActivity
  > {}

export function PlaceOrActivity(props: Props) {
  const [searchValue, setSearchValue] = useState(
    props.route?.params?.name || "",
  );
  const { t } = useTranslation();
  const { locations } = useLocations({});
  const stayedHome = locations.find(
    (location) =>
      location.name === t("screens:placeOrActivity:stayedHome") &&
      location.type === "manual",
  );

  useAccessibleTitle();

  const stayedHomeLocation =
    stayedHome || t("screens:placeOrActivity:stayedHome");

  const stayedHomeFavourite = stayedHome?.isFavourite || false;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [props.navigation]);

  const onLocationPress = useCallback(
    (location: Location | string) => {
      props.navigation.navigate(DiaryScreen.AddEntryManually, {
        location: location,
      });
    },
    [props.navigation],
  );

  const onStayHomePress = useCallback(() => {
    props.navigation.navigate(DiaryScreen.AddEntryManually, {
      location: stayedHomeLocation,
    });
  }, [props.navigation, stayedHomeLocation]);

  const onViewSavedPress = useCallback(() => {
    props.navigation.navigate(LocationScreen.PickSavedLocation);
  }, [props.navigation]);

  return (
    <>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        divider={true}
      />
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        placeholder={"Type name or address"}
        isAutofocus={true}
      />
      <VerticalSpacing height={5} />
      {!searchValue && (
        <>
          <DefaultLocationView>
            <IStayedHome
              onPress={onStayHomePress}
              accessibilityLabel={t(
                "screens:placeOrActivity:stayedHomeAccessibilityLabel",
              )}
              accessibilityHint={t(
                "screens:placeOrActivity:stayedHomeAccessibilityHint",
              )}
              accessibilityRole="button"
            >
              <LocationIcon
                locationType="manual"
                isFavourite={stayedHomeFavourite}
                alignLeft={true}
              />
              <ButtonText maxFontSizeMultiplier={2}>
                {stayedHomeLocation?.name ||
                  t("screens:placeOrActivity:stayedHome")}
              </ButtonText>
            </IStayedHome>
            <ViewSaved
              onPress={onViewSavedPress}
              accessibilityLabel={t(
                "screens:placeOrActivity:viewSavedAccessibilityLabel",
              )}
              accessibilityRole="button"
            >
              <IconView>
                <Icon source={assets.favouriteLocation} />
              </IconView>
              <ButtonText maxFontSizeMultiplier={2}>
                {t("screens:placeOrActivity:viewSaved")}
              </ButtonText>
              <Chevron source={assets.chevron} />
            </ViewSaved>
          </DefaultLocationView>
          <VerticalSpacing height={5} />
        </>
      )}
      <LocationList
        textSearch={searchValue}
        sortBy="lastVisited"
        onLocationPress={onLocationPress}
        showFooter={true}
        isPlaceOrActivity={true}
        alignLocationIconLeft={true}
      />
    </>
  );
}
