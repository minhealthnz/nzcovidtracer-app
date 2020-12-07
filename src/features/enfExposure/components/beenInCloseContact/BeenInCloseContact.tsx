import {
  HiddenAccessibilityTitle,
  Text,
  VerticalSpacing,
} from "@components/atoms";
import { ImageButton } from "@components/atoms";
import { SecondaryButton } from "@components/atoms/SecondaryButton";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { recordDismissENFAlert } from "@features/enfExposure/analytics";
import { dismissEnfAlert, ENFAlertData } from "@features/enfExposure/reducer";
import moment from "moment";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../../analytics";

const Container = styled.View`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: ${colors.carrot};
`;

const ContentContainer = styled.View`
  align-items: center;
`;

const CloseButton = styled(ImageButton)`
  padding: ${grid2x}px;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
`;

const DateText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  text-align: left;
  width: 100%;
  padding-right: 20px;
`;

const TitleText = styled(Text)`
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  text-align: center;
  padding-top: 4px;
  padding-bottom: 8px;
`;
const BodyText = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  text-align: center;
  padding-bottom: 4px;
`;

const HeaderImage = styled.Image`
  margin-top: 18px;
`;

export interface BeenInCloseContactProps {
  enfAlert: ENFAlertData | undefined;
}

export function BeenInCloseContact({ enfAlert }: BeenInCloseContactProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDismissPressed = useCallback(() => {
    if (!enfAlert) {
      return;
    }

    Alert.alert(
      t("screens:dashboard:beenInCloseContact:dismiss:title"),
      undefined,
      [
        {
          text: t("screens:dashboard:beenInCloseContact:dismiss:cancel"),
          style: "cancel",
        },
        {
          text: t("screens:dashboard:beenInCloseContact:dismiss:dimiss"),
          onPress: () => {
            recordDismissENFAlert(enfAlert);
            dispatch(dismissEnfAlert(enfAlert.exposureDate));
          },
        },
      ],
    );
  }, [dispatch, enfAlert, t]);

  const handlePressMore = useCallback(() => {
    if (enfAlert) {
      recordAnalyticEvent(AnalyticsEvent.ENFBannerFindOutMore);
      Linking.openURL(enfAlert.linkUrl);
    }
  }, [enfAlert]);

  if (!enfAlert) {
    return null;
  }

  const linkLabel = t("screens:dashboard:beenInCloseContact:more");

  return (
    <Container>
      <HiddenAccessibilityTitle
        label={t("accessibility:dashboard:beenInCloseContact")}
      />
      <CloseButton
        image={require("@assets/images/close.png")}
        onPress={handleDismissPressed}
        accessibilityLabel={t("accessibility:button:close")}
      />
      <ContentContainer>
        <DateText>
          {t("screens:dashboard:beenInCloseContact:lastExposed")}
          {moment(enfAlert.exposureDate).format("DD MMMM YYYY")}
        </DateText>
        {enfAlert.exposureCount > 1 && (
          <DateText>
            {`${enfAlert.exposureCount.toString()} ${t(
              "screens:dashboard:beenInCloseContact:numberOfExposures",
            )}`}
          </DateText>
        )}
        <HeaderImage
          source={require("@assets/images/alert-enf.png")}
          width={52}
          height={52}
        />
        <VerticalSpacing height={24} />
        <TitleText>{enfAlert.alertTitle}</TitleText>

        <BodyText>{enfAlert.alertMessage}</BodyText>

        <SecondaryButton
          accessibilityLabel={linkLabel}
          onPress={handlePressMore}
          text={linkLabel}
          accessibilityHint={t(
            "screens:dashboard:beenInCloseContact:moreAccessibilityHint",
          )}
        />
      </ContentContainer>
    </Container>
  );
}
