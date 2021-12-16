import { LocationIcon, VerticalSpacing } from "@components/atoms";
import { FocusAwareStatusBar } from "@components/atoms/FocusAwareStatusBar";
import { IconView } from "@components/atoms/LocationIcon";
import { SearchBar } from "@components/atoms/SearchBar";
import { Heading, Step } from "@components/molecules/FormV2";
import { colors, grid, grid2x, grid3x } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { LocationList } from "@features/locations/components/LocationList";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { Name } from "../components/LocationListItem";
import { getLocationName } from "../helper";
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

export const TopHeaderView = styled.View<{ paddingHorizontal?: number }>`
  background-color: ${colors.white}
  padding-top: ${grid3x}px;
  padding-horizontal: ${(props) =>
    props.paddingHorizontal ? props.paddingHorizontal : grid2x}px
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

  const startDate = props.route?.params?.startDate;
  const { t } = useTranslation();
  const { locations } = useLocations({});
  const stayedHome = locations.find(
    (location) =>
      location?.name === t("screens:placeOrActivity:stayedHome") &&
      location?.type === "manual",
  );

  useAccessibleTitle();

  const stayedHomeLocation =
    stayedHome || t("screens:placeOrActivity:stayedHome");

  const stayedHomeFavourite = stayedHome?.isFavourite || false;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.yellow,
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [props.navigation]);

  const onLocationPress = useCallback(
    (location: Location | string) => {
      setSearchValue(getLocationName(location));
      props.navigation.navigate(DiaryScreen.AddEntryManually, {
        location: location,
        startDate: startDate,
      });
    },
    [props.navigation, startDate],
  );

  const onStayHomePress = useCallback(() => {
    setSearchValue(
      stayedHomeLocation?.name || t("screens:placeOrActivity:stayedHome"),
    );
    props.navigation.navigate(DiaryScreen.AddEntryManually, {
      location: stayedHomeLocation,
      startDate: startDate,
    });
  }, [props.navigation, stayedHomeLocation, t, startDate]);

  const pickSavedLocationCallBack = useCallback(
    (name: string) => {
      setSearchValue(name);
    },
    [setSearchValue],
  );

  const onViewSavedPress = useCallback(() => {
    props.navigation.navigate(LocationScreen.PickSavedLocation, {
      startDate: startDate,
      callBack: pickSavedLocationCallBack,
    });
  }, [props.navigation, startDate, pickSavedLocationCallBack]);

  const renderHeader = useMemo(() => {
    return (
      <>
        <TopHeaderView>
          <Step maxFontSizeMultiplier={2}>
            {t("screens:placeOrActivity:stepOneOfTwo")}
          </Step>
          <Heading maxFontSizeMultiplier={2}>
            {t("screens:placeOrActivity:placeOrActivity")}
          </Heading>
        </TopHeaderView>
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
      </>
    );
  }, [
    onStayHomePress,
    stayedHomeLocation,
    onViewSavedPress,
    stayedHomeFavourite,
    t,
    searchValue,
  ]);

  return (
    <>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.yellow}
        divider={true}
      />
      {renderHeader}
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
