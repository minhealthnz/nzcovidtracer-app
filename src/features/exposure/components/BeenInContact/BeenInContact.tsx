import {
  HiddenAccessibilityTitle,
  Text,
  VerticalSpacing,
} from "@components/atoms";
import { ImageButton } from "@components/atoms";
import {
  colors,
  contactAlertslink,
  fontFamilies,
  fontSizes,
  grid2x,
  grid4x,
} from "@constants";
import { recordDismissLocationAlert } from "@features/exposure/analytics";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../../analytics";
import { acknowledgeMatches } from "../../reducer";
import { selectMatch } from "../../selectors";
import { Buttons } from "./Buttons";

const Container = styled.View<{ callbackRequested: boolean }>`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: ${(props) =>
    props.callbackRequested ? colors.lightYellow : colors.yellow};
`;

const ContentContainer = styled.View`
  align-items: center;
`;

const CloseButton = styled(ImageButton)`
  padding: ${grid2x}px ${grid2x}px ${grid4x}px ${grid4x}px;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
`; // adding z-index to fix "shifted" hitbox

const DateText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  text-align: left;
  align-self: flex-start;
  margin-right: 64px;
`;

// TODO Extract h1 component
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

export interface BeenInContactProps {
  onRequestCallback(): void;
}

export function BeenInContact({ onRequestCallback }: BeenInContactProps) {
  const { t } = useTranslation();
  const exposureMatch = useSelector(selectMatch);

  const callbackRequested = useMemo(
    () => exposureMatch?.callbackRequested ?? false,
    [exposureMatch],
  );

  const dispatch = useDispatch();

  const handleDismissPressed = useCallback(() => {
    if (!exposureMatch) {
      return;
    }
    Alert.alert(t("screens:dashboard:beenInContact:dismiss:title"), undefined, [
      {
        text: t("screens:dashboard:beenInContact:dismiss:cancel"),
        style: "cancel",
      },
      {
        text: t("screens:dashboard:beenInContact:dismiss:dimiss"),
        onPress: () => {
          recordDismissLocationAlert(exposureMatch);
          dispatch(acknowledgeMatches());
        },
      },
    ]);
  }, [dispatch, t, exposureMatch]);

  const handleRequestCallback = useCallback(() => {
    if (exposureMatch?.callbackRequested) {
      return;
    }
    onRequestCallback();
  }, [exposureMatch, onRequestCallback]);

  const handlePressMore = useCallback(() => {
    if (exposureMatch == null) {
      return;
    }
    recordAnalyticEvent(AnalyticsEvent.ExposureNotificationFindOutMore);
    Linking.openURL(exposureMatch.appBannerLinkUrl || contactAlertslink);
  }, [exposureMatch]);

  if (exposureMatch == null) {
    return null;
  }

  return (
    <Container callbackRequested={callbackRequested}>
      <HiddenAccessibilityTitle
        label={t("accessibility:dashboard:beenInContact")}
      />
      <CloseButton
        image={require("@assets/images/close.png")}
        onPress={handleDismissPressed}
        accessibilityLabel={t("accessibility:button:close")}
      />
      <ContentContainer>
        {!!exposureMatch.checkInStartDate && (
          <DateText>
            {t("screens:dashboard:beenInContact:lastExposed")}
            {moment(exposureMatch.checkInStartDate).format("DD MMMM YYYY")}
          </DateText>
        )}
        <HeaderImage
          source={require("@assets/images/alert-location.png")}
          width={52}
          height={52}
        />
        <VerticalSpacing height={24} />
        <TitleText>
          {exposureMatch.appBannerTitle ||
            t("screens:dashboard:beenInContact:title")}
        </TitleText>

        <BodyText>
          {exposureMatch.appBannerBody ||
            t("screens:dashboard:beenInContact:description")}
        </BodyText>

        <VerticalSpacing height={20} />

        <Buttons
          callbackEnabled={exposureMatch.appBannerRequestCallbackEnabled}
          callbackRequested={exposureMatch.callbackRequested}
          appBannerLinkLabel={exposureMatch.appBannerLinkLabel}
          onPressRequestCallback={handleRequestCallback}
          onPressMore={handlePressMore}
          secondaryButtonAccessibilityHint={t(
            "screens:dashboard:beenInContact:moreAccessibilityHint",
          )}
        />
      </ContentContainer>
    </Container>
  );
}
