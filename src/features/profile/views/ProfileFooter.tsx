import { Text, VerticalSpacing } from "@components/atoms";
import {
  contactLink,
  copyrightLink,
  feedbackLink,
  fontSizes,
  helpLink,
  privacyLink,
  termsOfUseLink,
} from "@constants";
import { Link } from "@features/profile/components/Link";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import styled from "styled-components/native";

import config from "../../../config";
import { gray } from "../colors";

interface Props {
  onPressDebugMenu: () => void;
}

const Version = styled(Text)`
  color: ${gray};
  padding: 0 8px 16px 8px;
`;

export function ProfileFooter({ onPressDebugMenu }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Link
        text={t("screens:profile:feeback")}
        onPress={() => {
          Linking.openURL(feedbackLink);
        }}
        accessibilityLabel={t("screens:profile:feeback")}
      />
      <Link
        text={t("screens:profile:privacyNSecurity")}
        onPress={() => {
          Linking.openURL(privacyLink);
        }}
        accessibilityLabel={t("screens:profile:privacyNSecurity")}
      />
      <Link
        text={t("screens:profile:termsOfUse")}
        onPress={() => {
          Linking.openURL(termsOfUseLink);
        }}
        accessibilityLabel={t("screens:profile:termsOfUse")}
      />
      <Link
        text={t("screens:profile:copyrightNAttribution")}
        onPress={() => {
          Linking.openURL(copyrightLink);
        }}
        accessibilityLabel={t("screens:profile:copyrightNAttribution")}
      />
      <Link
        text={t("screens:profile:help")}
        onPress={() => {
          Linking.openURL(helpLink);
        }}
        accessibilityLabel={t("screens:profile:help")}
      />
      <Link
        text={t("screens:profile:contactUs")}
        onPress={() => {
          Linking.openURL(contactLink);
        }}
        accessibilityLabel={t("screens:profile:contactUs")}
      />
      {config.IsDev && (
        <Link
          text={"Dev Menu"}
          onPress={onPressDebugMenu}
          accessibilityLabel="Dev Menu"
        />
      )}
      <VerticalSpacing height={20} />
      <Version fontSize={fontSizes.small} fontFamily="open-sans">
        V{config.APP_VERSION}
        {" (" + config.APPCENTER_BUILD_ID + ")"}
      </Version>
      <Version fontSize={fontSizes.small} fontFamily="open-sans">
        {t("screens:profile:disclaimer")}
      </Version>
      <VerticalSpacing height={26} />
    </>
  );
}
