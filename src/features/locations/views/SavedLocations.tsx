import { HeaderButton } from "@components/atoms/HeaderButton";
import { selectHasDiaryEntries } from "@features/diary/selectors";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { SearchBar } from "../../../components/atoms/SearchBar";
import { LocationList } from "../components/LocationList";
import { SearchListDivider } from "../components/SearchListDivider";
import { LocationScreen } from "../screens";

export interface SavedLocationsProps
  extends StackScreenProps<MainStackParamList, LocationScreen.SavedLocations> {}

export function SavedLocations(props: SavedLocationsProps) {
  const [searchValue, setSearchValue] = useState("");
  const hasDiaryEntries = useSelector(selectHasDiaryEntries);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          text={t("screens:savedLocations:saveNew")}
          onPress={() => {
            props.navigation.navigate(
              hasDiaryEntries
                ? LocationScreen.SaveNewLocation
                : LocationScreen.SaveNewLocationEmpty,
            );
          }}
          accessibilityLabel={t("screens:savedLocations:accessibility:saveNew")}
          style={styles.saveNewButton}
        />
      ),
    });
  }, [props.navigation, t, hasDiaryEntries]);

  return (
    <>
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        placeholder={"Search for a name or address"}
      />
      <SearchListDivider />
      <LocationList
        rightButton="delete"
        isFavourite={true}
        textSearch={searchValue}
        sortBy="name"
        alignLocationIconLeft={true}
        accessibilityHint={t(
          "screens:savedLocations:accessibility:deleteLocationHint",
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  saveNewButton: {
    paddingRight: 20,
  },
});
