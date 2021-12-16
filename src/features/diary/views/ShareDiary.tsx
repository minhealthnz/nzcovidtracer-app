import { VerticalSpacing } from "@components/atoms";
import { Tip, TipText } from "@components/atoms/Tip";
import { Description, FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React from "react";
import { useTranslation } from "react-i18next";

import { DiaryScreen } from "../screens";

const assets = {
  headerImage: require("@assets/images/Send.png"),
};

export interface ShareDiaryProps
  extends StackScreenProps<MainStackParamList, DiaryScreen.ShareDiary> {}

export function ShareDiary(props: ShareDiaryProps) {
  const { t } = useTranslation();
  useAccessibleTitle();

  const onContinue = () => {
    props.navigation.navigate(DiaryScreen.ShareDiaryList);
  };

  return (
    <FormV2
      headerImage={assets.headerImage}
      heading={t("screens:shareDiary:title")}
      description={t("screens:shareDiary:description")}
      buttonTestID="shareDiary:continue"
      onButtonPress={onContinue}
      buttonText={t("screens:shareDiary:continue")}
      snapButtonsToBottom
    >
      <Tip backgroundColor={colors.lightYellow}>
        <TipText>{t("screens:shareDiary:tip")}</TipText>
      </Tip>
      <VerticalSpacing height={30} />
      <Description>{t("screens:shareDiary:subText")}</Description>
    </FormV2>
  );
}
