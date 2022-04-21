import { Text } from "@components/atoms";
import { colors, fontFamilies, grid2x, grid3x } from "@constants";
import { useAppDispatch } from "@lib/useAppDispatch";
import { unwrapResult } from "@reduxjs/toolkit";
import pupa from "pupa";
import React, { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";

import { addFavourite } from "../actions/addFavourite";
import { removeFavourite } from "../actions/removeFavourite";
import { useLocations } from "../hooks/useLocations";
import { Location } from "../types";
import { ListHeader } from "./ListHeader";
import { LocationListItem } from "./LocationListItem";
import { LocationSuccessContext } from "./LocationSuccessContextProvider";

const Separator = styled.View`
  background-color: ${colors.platinum};
  height: 1px;
  width: 100%;
`;

const Footer = styled.TouchableOpacity`
  background-color: ${colors.white};
  padding-horizontal: ${grid3x}px;
  padding-vertical: ${grid2x}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FooterText = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  color: ${colors.primaryBlack};
  text-decoration-line: underline;
`;

export interface LocationListProps {
  textSearch?: string;
  sortBy: "name" | "lastVisited";
  onLocationPress?: (location: Location | string) => void;
  showFooter?: boolean;
  rightButton?: "delete" | "save";
  isFavourite?: boolean;
  isPlaceOrActivity?: boolean;
  accessibilityHint?: string;
  alignLocationIconLeft?: boolean;
}

export function LocationList(props: LocationListProps) {
  const {
    sortBy,
    onLocationPress,
    showFooter,
    rightButton,
    isFavourite,
    isPlaceOrActivity,
    accessibilityHint,
    alignLocationIconLeft,
  } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locations, loadMore, refresh, refreshing } = useLocations({
    isFavourite,
    textSearch: props.textSearch,
    sortBy: sortBy,
    hasDiaryEntry: isPlaceOrActivity,
  });

  const { setLocationId } = useContext(LocationSuccessContext);

  const deleteItem = useCallback(
    (location: Location) => {
      if (location.hasDiaryEntry || location.type === "manual") {
        dispatch(removeFavourite({ locationId: location.id }));
        return;
      }
      Alert.alert(
        t("screens:savedLocations:deleteModal:title", {
          locationName: location.name,
        }),
        t("screens:savedLocations:deleteModal:description"),
        [
          {
            text: t("screens:savedLocations:deleteModal:cancel"),
            style: "cancel",
          },
          {
            text: t("screens:savedLocations:deleteModal:delete"),
            onPress: () => {
              dispatch(removeFavourite({ locationId: location.id }));
            },
          },
        ],
      );
    },
    [dispatch, t],
  );

  const saveLocation = useCallback(
    (id: string) => {
      dispatch(
        addFavourite({
          locationId: id,
        }),
      )
        .then(unwrapResult)
        .then(() => setLocationId(id));
    },
    [dispatch, setLocationId],
  );

  const addManualEntry = useCallback(() => {
    if (!!onLocationPress && !!props.textSearch) {
      onLocationPress(props.textSearch);
    }
  }, [onLocationPress, props.textSearch]);

  const addManualEntryAccessibilityHint = useMemo(() => {
    return pupa(t("screens:savedLocations:addManualEntryAccessibilityHint"), [
      locations.length + 1,
    ]);
  }, [locations.length, t]);

  const renderFooter = useMemo(() => {
    if (showFooter && !!props.textSearch) {
      return (
        <>
          <Separator />
          <Footer
            onPress={addManualEntry}
            accessibilityLabel={t("screens:savedLocations:addManualEntry")}
            accessibilityHint={addManualEntryAccessibilityHint}
          >
            <FooterText>
              {t("screens:savedLocations:addManualEntry")}
            </FooterText>
          </Footer>
          <Separator />
        </>
      );
    } else {
      return undefined;
    }
  }, [
    showFooter,
    props.textSearch,
    t,
    addManualEntry,
    addManualEntryAccessibilityHint,
  ]);

  const onRightPress = useCallback(
    (location: Location) => {
      switch (rightButton) {
        case "delete":
          return () => deleteItem(location);
        case "save":
          return () => saveLocation(location.id);
        default:
          return;
      }
    },
    [rightButton, deleteItem, saveLocation],
  );

  const additionalIndex = props.textSearch ? 1 : 0;

  const renderItem = useCallback(
    (data: { item: Location; index: number }) => {
      return (
        <LocationListItem
          onLocationPress={onLocationPress}
          rightButton={rightButton}
          location={data.item}
          onPressRightButton={onRightPress(data.item)}
          index={data.index + 1}
          totalNumberOfLocations={locations.length + additionalIndex}
          accessibilityHint={accessibilityHint}
          alignLocationIconLeft={alignLocationIconLeft}
        />
      );
    },
    [
      onRightPress,
      rightButton,
      onLocationPress,
      locations.length,
      additionalIndex,
      accessibilityHint,
      alignLocationIconLeft,
    ],
  );

  return (
    <KeyboardAwareFlatList
      style={styles.List}
      scrollEnabled={true}
      data={locations}
      renderItem={renderItem}
      onRefresh={() => refresh()}
      refreshing={refreshing}
      onEndReachedThreshold={8}
      onEndReached={() => loadMore()}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={renderFooter}
      keyboardShouldPersistTaps="handled"
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        rightButton === "save" ||
        (isPlaceOrActivity && locations.length > 0) ? (
          <ListHeader
            isSearchEmpty={locations.length === 0 && !!props.textSearch}
            isLocationEmpty={locations.length === 0 && !props.textSearch}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  List: {
    backgroundColor: colors.white,
  },
});
