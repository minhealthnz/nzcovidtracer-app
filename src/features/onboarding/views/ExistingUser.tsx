import { FormV2 } from "@components/molecules/FormV2";
import { colors } from "@constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { IconText } from "../components/IconText";
import { OnboardingScreen } from "../screens";
import { selectHasOnboardedPreEnf } from "../selectors";
import { styles } from "../styles";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

const assets = {
  info: require("../assets/images/info.png"),
  iconPassword: require("../assets/icons/password.png"),
  iconStar: require("../assets/icons/star.png"),
  iconBluetooth: require("../assets/icons/bluetooth.png"),
};

export interface ExistingUserProps
  extends StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.ExistingUser
  > {}

// TODO BUG Need a separate flag for "hasSeenChanges"
export function ExistingUser(props: ExistingUserProps) {
  const hasOnboardedPreEnf = useSelector(selectHasOnboardedPreEnf);
  const { nextLoading, navigateNext } = useOnboardingFlow(
    props,
    OnboardingScreen.ExistingUser,
  );

  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    navigateNext();
  }, [navigateNext]);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={assets.info}
      headerBackgroundColor={colors.lightBlue}
      heading={t("screens:existingUser:title")}
      headingStyle={styles.headingBig}
      buttonText={t("screens:existingUser:okay")}
      onButtonPress={handlePress}
      buttonLoading={nextLoading}
    >
      <IconText
        text={t("screens:existingUser:infoEnf")}
        source={assets.iconBluetooth}
      />
      {!hasOnboardedPreEnf && (
        <>
          <IconText
            text={t("screens:existingUser:infoPassword")}
            source={assets.iconPassword}
          />
          <IconText
            text={t("screens:existingUser:infoLook")}
            source={assets.iconStar}
          />
        </>
      )}
    </FormV2>
  );
}
