import { Text } from "@components/atoms/Text";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { FormV2 } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { deleteEntry } from "@features/diary/reducer";
import useEntry from "@hooks/diary/useEntry";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { DiaryScreen } from "../screens";
import { DiaryStackParamList } from "./DiaryStack";

const KeyText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryGray};
`;

const ValueText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryBlack};
  margin-bottom: ${grid2x}px;
`;

interface Props
  extends StackScreenProps<DiaryStackParamList, DiaryScreen.DiaryEntry> {}

export function DiaryEntryScreen(props: Props) {
  const { t } = useTranslation();
  const { id } = props.route.params;
  const entry = useEntry(id);

  const dispatch = useDispatch();

  const onEditPress = () => {
    props.navigation.navigate(DiaryScreen.EditEntry, { id });
  };

  const onDeletePress = () => {
    Alert.alert(
      t("screens:diaryEntry:deleteModal:title"),
      t("screens:diaryEntry:deleteModal:message"),
      [
        {
          text: t("screens:diaryEntry:deleteModal:ok"),
          style: "default",
          onPress: () => {
            dispatch(deleteEntry(entry.id));
            props.navigation.navigate(DiaryScreen.Diary);
          },
        },
        { text: t("screens:diaryEntry:deleteModal:cancel"), style: "cancel" },
      ],
    );
  };

  const renderFooter = useCallback(
    () => <Disclaimer text={t("components:diaryDisclaimer:disclaimer")} />,
    [t],
  );

  useAccessibleTitle();

  if (!entry) {
    return null;
  }

  return (
    <FormV2
      buttonText={t("screens:diaryEntry:edit")}
      onButtonPress={onEditPress}
      secondaryButtonText={t("screens:diaryEntry:delete")}
      onSecondaryButtonPress={onDeletePress}
      renderFooter={renderFooter}
    >
      <KeyText>{t("screens:diaryEntry:placeOrActivity")}</KeyText>
      <ValueText>{entry.name}</ValueText>

      <KeyText>{t("screens:diaryEntry:dateTime")}</KeyText>
      <ValueText>
        {moment(entry.startDate).format("dddd D MMMM YYYY h:mma")}
      </ValueText>

      {!!entry.address && (
        <>
          <KeyText>{t("screens:diaryEntry:address")}</KeyText>
          <ValueText>{entry.address}</ValueText>
        </>
      )}

      {!!entry.globalLocationNumber && (
        <>
          <KeyText>{t("screens:diaryEntry:gln")}</KeyText>
          <ValueText>{entry.globalLocationNumber}</ValueText>
        </>
      )}

      <KeyText>{t("screens:diaryEntry:details")}</KeyText>
      <ValueText testID="diaryEntry:details">{entry.details || ""}</ValueText>
    </FormV2>
  );
}
