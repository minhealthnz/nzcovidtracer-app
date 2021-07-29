import { Text, VerticalSpacing } from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { Card } from "@components/molecules/Card";
import {
  contactLink,
  copyrightLink,
  feedbackLink,
  fontSizes,
  helpLink,
  privacyLink,
  termsOfUseLink,
} from "@constants";
import _ from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
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

  const footerList = useMemo(() => {
    return _.compact([
      {
        title: t("screens:profile:feeback"),
        isLink: true,
        onPress: () => {
          Linking.openURL(feedbackLink);
        },
        accessibilityLabel: t("screens:profile:feeback"),
        isConnected: true,
      },
      {
        title: t("screens:profile:privacyNSecurity"),
        isLink: true,
        onPress: () => {
          Linking.openURL(privacyLink);
        },
        accessibilityLabel: t("screens:profile:privacyNSecurity"),
        isConnected: true,
      },
      {
        title: t("screens:profile:termsOfUse"),
        isLink: true,
        onPress: () => {
          Linking.openURL(termsOfUseLink);
        },
        accessibilityLabel: t("screens:profile:termsOfUse"),
        isConnected: true,
      },
      {
        title: t("screens:profile:copyrightNAttribution"),
        isLink: true,
        onPress: () => {
          Linking.openURL(copyrightLink);
        },
        accessibilityLabel: t("screens:profile:copyrightNAttribution"),
        isConnected: true,
      },
      {
        title: t("screens:profile:help"),
        isLink: true,
        onPress: () => {
          Linking.openURL(helpLink);
        },
        accessibilityLabel: t("screens:profile:help"),
        isConnected: true,
      },
      {
        title: t("screens:profile:contactUs"),
        isLink: true,
        onPress: () => {
          Linking.openURL(contactLink);
        },
        accessibilityLabel: t("screens:profile:contactUs"),
        isConnected: true,
      },
      config.IsDev && {
        title: "Dev Menu",
        isLink: true,
        onPress: () => {
          onPressDebugMenu();
        },
        accessibilityLabel: "Dev Menu",
        isConnected: true,
      },
    ]);
  }, [t, onPressDebugMenu]);

  return (
    <>
      {footerList.map((footer, index) => (
        <View key={index}>
          <Card {...footer} />
          {index < footerList.length - 1 && <Divider />}
        </View>
      ))}
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
