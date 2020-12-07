import { FormV2 } from "@components/molecules/FormV2";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { NHIScreen } from "../screens";
import { NHIStackParamList } from "./NHINavigator";

const assets = {
  fingerprint: require("@assets/images/fingerprint.png"),
};

interface Props
  extends StackScreenProps<NHIStackParamList, NHIScreen.Privacy> {}
export default function Privacy(props: Props) {
  const { t } = useTranslation();

  const handleNextPress = () => {
    props.navigation.navigate(NHIScreen.Add);
  };

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.fingerprint}
      heading={t("screens:privacyNHI:title")}
      description={t("screens:privacyNHI:description")}
      buttonText={t("screens:buttonNHI:continue")}
      onButtonPress={handleNextPress}
    />
  );
}
