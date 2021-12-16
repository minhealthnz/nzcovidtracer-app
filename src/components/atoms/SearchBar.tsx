import { colors, fontFamilies, fontSizes, grid } from "@constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const assets = {
  search: require("@assets/icons/search.png"),
  close: require("@assets/icons/search-close.png"),
};

const MainView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${colors.white};
  padding-vertical: 12px;
  padding-horizontal: ${grid}px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-width: 1px;
  border-color: ${colors.platinum};
`;

const SearchView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const SearchIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const CloseIcon = styled.Image`
  width: 26px;
  height: 26px;
`;

const SearchInput = styled.TextInput`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
  color: ${colors.black};
  flex: 1;
  padding-left: ${grid}px;
`;

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  isAutofocus?: boolean;
}

export function SearchBar(props: Props) {
  const dismissEnteredText = useCallback(() => {
    props.onChange("");
  }, [props]);

  const { t } = useTranslation();

  return (
    <MainView>
      <SearchView>
        <SearchIcon source={assets.search} />
        <SearchInput
          accessible={true}
          accessibilityLabel={t("accessibility:searchBarLabel")}
          accessibilityHint={t("accessibility:searchBarHint")}
          value={props.value}
          onChangeText={props.onChange}
          placeholder={props.placeholder}
          placeholderTextColor={colors.darkGrey}
          numberOfLines={1}
          autoFocus={!!props.isAutofocus}
        />
      </SearchView>
      {props.value.length > 0 && (
        <CloseButton
          onPress={dismissEnteredText}
          accessibilityLabel={t("accessibility:clearInput")}
          accessibilityRole="button"
        >
          <CloseIcon source={assets.close} />
        </CloseButton>
      )}
    </MainView>
  );
}
