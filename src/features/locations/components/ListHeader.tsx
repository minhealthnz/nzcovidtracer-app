import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const ListHeaderView = styled.View`
  width: 100%;
  padding-top: ${grid2x}px;
  padding-horizontal: ${grid2x}px;
  background-color: ${colors.white};
`;

const ListHeaderText = styled(Text)`
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  color: ${colors.primaryGray};
`;

const ListHeaderTextEmpty = styled(Text)`
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.primaryGray};
`;

interface ListHeaderProps {
  isSearchEmpty?: boolean;
  isLocationEmpty?: boolean;
}

export function ListHeader(props: ListHeaderProps) {
  const { t } = useTranslation();
  return (
    <ListHeaderView>
      {props.isSearchEmpty ? (
        <ListHeaderTextEmpty>
          {t("screens:saveNewLocation:searchEmptyList")}
        </ListHeaderTextEmpty>
      ) : props.isLocationEmpty ? (
        <ListHeaderTextEmpty>
          {t("screens:saveNewLocation:locationsEmptyList")}
        </ListHeaderTextEmpty>
      ) : (
        <ListHeaderText>
          {t("screens:saveNewLocation:listHeader")}
        </ListHeaderText>
      )}
    </ListHeaderView>
  );
}
