import { Text } from "@components/atoms/Text";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { FormV2 } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes, grid2x, grid4x } from "@constants";
import { deleteEntry } from "@features/diary/reducer";
import useEntry from "@hooks/diary/useEntry";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import moment from "moment";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, View } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { DiaryScreen } from "../screens";

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

const BannerView = styled(View)`
  flex: 1;
  flex-direction: column;
  padding: 24px 14px 26px 14px;
  margin-bottom: ${grid4x}px;
  background-color: ${colors.yellow};
`;

const BannerTitleView = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const BannerTitleText = styled(Text)`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 20px;
  padding-bottom: 8px;
`;

const BannerBodyText = styled(Text)`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-family: ${fontFamilies["open-sans"]};
  padding: 0 6px;
`;

const BannerImage = styled(Image)`
  margin-right: 14px;
  width: 40px;
  height: 40px;
`;

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.DiaryEntry> {}

export function DiaryEntryScreen(props: Props) {
  const { t } = useTranslation();
  const { id } = props.route.params;
  const entry = useEntry(id);

  const assets = {
    locationAlert: require("@assets/images/error-small.png"),
  };

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
            props.navigation.goBack();
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

  const buttonText = entry.isRisky ? undefined : t("screens:diaryEntry:edit");

  return (
    <FormV2
      buttonText={buttonText}
      onButtonPress={onEditPress}
      secondaryButtonText={t("screens:diaryEntry:delete")}
      onSecondaryButtonPress={onDeletePress}
      renderFooter={renderFooter}
    >
      {entry.isRisky && (
        <BannerView>
          <BannerTitleView>
            <BannerImage source={assets.locationAlert} />
            <BannerTitleText>
              {entry.bannerTitle || t("screens:diaryEntry:bannerTitle")}
            </BannerTitleText>
          </BannerTitleView>
          <BannerBodyText>
            {entry.bannerBody || t("screens:diaryEntry:bannerBody")}
          </BannerBodyText>
        </BannerView>
      )}

      <KeyText>{t("screens:diaryEntry:placeOrActivity")}</KeyText>
      <ValueText selectable>{entry.name}</ValueText>

      <KeyText>{t("screens:diaryEntry:dateTime")}</KeyText>
      <ValueText selectable>
        {moment(entry.startDate).format("dddd D MMMM YYYY h:mma")}
      </ValueText>

      {!!entry.address && (
        <>
          <KeyText>{t("screens:diaryEntry:address")}</KeyText>
          <ValueText selectable>{entry.address}</ValueText>
        </>
      )}

      {!!entry.globalLocationNumber && (
        <>
          <KeyText>{t("screens:diaryEntry:gln")}</KeyText>
          <ValueText selectable>{entry.globalLocationNumber}</ValueText>
        </>
      )}

      <KeyText>{t("screens:diaryEntry:details")}</KeyText>
      <ValueText selectable testID="diaryEntry:details">
        {entry.details || ""}
      </ValueText>
    </FormV2>
  );
}
