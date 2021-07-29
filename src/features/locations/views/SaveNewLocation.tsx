import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchBar } from "../../../components/atoms/SearchBar";
import { AddLocationSuccessBanner } from "../components/AddLocationSuccessBanner";
import { LocationList } from "../components/LocationList";
import { LocationSuccessContextProvider } from "../components/LocationSuccessContextProvider";
import { SearchListDivider } from "../components/SearchListDivider";

export function SaveNewLocation() {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  useAccessibleTitle();

  return (
    <LocationSuccessContextProvider>
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        placeholder={"Search for a name or address"}
      />
      <SearchListDivider />
      <LocationList
        textSearch={searchValue}
        rightButton="save"
        isFavourite={false}
        sortBy="name"
        accessibilityHint={t("screens:saveNewLocation:accessibilityHint")}
        alignLocationIconLeft={true}
      />
      <AddLocationSuccessBanner />
    </LocationSuccessContextProvider>
  );
}
