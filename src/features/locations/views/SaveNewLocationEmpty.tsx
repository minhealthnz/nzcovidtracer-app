import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { LocationScreen } from "../screens";

const assets = {
  headerImage: require("@features/locations/assets/images/diary.png"),
};

export interface SaveNewLocationEmptyProps
  extends StackScreenProps<
    MainStackParamList,
    LocationScreen.SaveNewLocationEmpty
  > {}

export function SaveNewLocationEmpty(props: SaveNewLocationEmptyProps) {
  const { t } = useTranslation();
  const onButtonPress = useCallback(() => {
    props.navigation.replace(DiaryScreen.AddEntryManually);
  }, [props.navigation]);
  return (
    <FormV2
      headerBackgroundColor={colors.lightGrey}
      headerImage={assets.headerImage}
      snapButtonsToBottom={false}
      buttonText={t("screens:saveNewLocationEmpty:buttonLabel")}
      onButtonPress={onButtonPress}
      heading={t("screens:saveNewLocationEmpty:title")}
      description={t("screens:saveNewLocationEmpty:description")}
    />
  );
}
