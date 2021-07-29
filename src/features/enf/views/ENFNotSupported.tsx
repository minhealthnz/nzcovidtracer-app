import { BulletItem } from "@components/atoms/BulletItem";
import { SecondaryButton } from "@components/atoms/SecondaryButton";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2 } from "@components/molecules/FormV2";
import {
  aboutBluetoothLink,
  colors,
  feedbackLink,
  fontFamilies,
  fontSizes,
  grid2x,
  grid3x,
} from "@constants";
import { commonStyles } from "@lib/commonStyles";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";

const MoreInfo = styled(SecondaryButton)`
  padding: 0;
  padding-top: ${grid3x}px;
  padding-bottom: ${grid2x}px;
  align-items: flex-start;
`;

export const Subtext = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
`;

const LinkWrap = styled(Subtext)`
  margin: 0;
`;

const Link = styled(Subtext)`
  font-family: ${fontFamilies["open-sans-bold"]};
  text-decoration: underline;
  font-size: ${fontSizes.small}px;
`;

const TipContainer = styled.View`
  padding-top: 15px;
`;

export function ENFNotSupported() {
  const { t } = useTranslation();
  const onFindOutMorePress = () => {
    Linking.openURL(aboutBluetoothLink);
  };

  const onHelpLinkPress = useCallback(() => {
    Linking.openURL(feedbackLink);
  }, []);

  useAccessibleTitle();

  return (
    <FormV2
      headerImage={require("../assets/images/information.png")}
      heading={t("screens:enfSettings:notSupported:title")}
      headerImageStyle={commonStyles.headerImage}
      headerBackgroundColor={colors.lightGrey}
      headerImageAccessibilityLabel={t(
        "screens:enfSettings:headerImageAccessibilityLabel",
      )}
    >
      <Subtext>{t("screens:enfSettings:notSupported:subtext")}</Subtext>
      <MoreInfo
        text={t("screens:enfSettings:secondaryButton")}
        onPress={onFindOutMorePress}
        accessibilityLabel={t(
          "screens:enfSettings:secondaryButtonAccessibilityLabel",
        )}
        accessibilityHint={t(
          "screens:enfSettings:secondaryButtonAccessibilityHint",
        )}
      />
      <BulletItem>
        <Subtext>{t("screens:enfSettings:notSupported:subtextP1")}</Subtext>
      </BulletItem>
      <BulletItem>
        <Subtext>{t("screens:enfSettings:notSupported:subtextP2")}</Subtext>
      </BulletItem>
      <BulletItem>
        <Subtext>{t("screens:enfSettings:notSupported:subtextP3")}</Subtext>
        <TouchableOpacity accessibilityRole="link" onPress={onHelpLinkPress}>
          <LinkWrap>
            <Link>{t("screens:enfSettings:notSupported:link")}</Link>
          </LinkWrap>
        </TouchableOpacity>
      </BulletItem>
      <TipContainer>
        <Tip backgroundColor={colors.lightYellow}>
          <TipText>{t("screens:enfSettings:notSupported:subtextP4")}</TipText>
        </Tip>
      </TipContainer>
    </FormV2>
  );
}
