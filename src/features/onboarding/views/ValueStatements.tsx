import { Text } from "@components/atoms";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { fontFamilies, grid2x } from "@constants";
import { grid } from "@constants";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { DummyStatusBar } from "../../../components/atoms/DummyStatusBar";
import { IconText } from "../components/IconText";
import { OnboardingScreen } from "../screens";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

const assets = {
  heroMedium: require("../assets/images/hero-small.png"),
  iconScan: require("../assets/images/scan.png"),
  iconAlarm: require("../assets/icons/alarm.png"),
  iconBluetooth: require("../assets/icons/bluetooth.png"),
};

const Title = styled(Text)`
  padding-top: ${grid}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: 36px;
  line-height: 44px;
`;

const SubTitle = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: 24px;
  line-height: 26px;
  padding-top: 4px;
  padding-bottom: ${grid2x}px;
`;

export function ValueStatements(
  props: StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.ValueStatements
  >,
) {
  const { t } = useTranslation();
  const formRef = useRef<FormV2Handle>(null);

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.RegistrationCreate);
    }, []),
  );

  const handleButtonPrimaryPress = () => {
    navigateNext();
  };

  const { navigateNext, nextLoading } = useOnboardingFlow(
    props,
    OnboardingScreen.ValueStatements,
  );

  return (
    <>
      <DummyStatusBar />
      <FormV2
        ref={formRef}
        buttonText={t("screens:valueStatements:buttonPrimary")}
        onButtonPress={handleButtonPrimaryPress}
        headerBanner={assets.heroMedium}
        keyboardAvoiding
        buttonLoading={nextLoading}
      >
        <Title>{t("screens:valueStatements:title")}</Title>
        <SubTitle>{t("screens:valueStatements:subtitle")}</SubTitle>
        <IconText
          text={t("screens:valueStatements:info1")}
          source={assets.iconScan}
        />
        <IconText
          text={t("screens:valueStatements:info2")}
          source={assets.iconBluetooth}
        />
        <IconText
          text={t("screens:valueStatements:info3")}
          source={assets.iconAlarm}
          paddingBottom={grid2x}
        />
      </FormV2>
    </>
  );
}
