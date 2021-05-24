import { HiddenAccessibilityTitle, Text } from "@components/atoms";
import { CloseButton } from "@components/atoms/CloseButton";
import { HeadingText } from "@components/molecules/NotificationCard";
import { colors, contactAlertslink, fontFamilies, fontSizes } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { recordDismissLocationAlert } from "@features/exposure/analytics";
import { navigationRef } from "@navigation/navigation";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../../analytics";
import { acknowledgeMatches } from "../../reducer";
import {
  selectCheckInId,
  selectMatch,
  selectRiskyLocationName,
} from "../../selectors";
import { Buttons } from "./Buttons";

const Container = styled.View<{ callbackRequested: boolean }>`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: ${(props) =>
    props.callbackRequested ? colors.lightYellow : colors.yellow};
`;

const LinkText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  text-decoration-line: underline;
  text-align: left;
  align-self: flex-start;
`;

// TODO Extract h1 component
const TitleText = styled(Text)`
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  padding-top: 8px;
  flex: 1;
  padding-left: 10px;
`;
const BodyText = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  padding-bottom: 4px;
`;

const HeaderImage = styled.Image`
  width: 40px;
  height: 40px;
  align-self: flex-start;
  margin-top: 6px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 0px;
`;

export interface BeenInContactProps {
  onRequestCallback(): void;
}

export function BeenInContact({ onRequestCallback }: BeenInContactProps) {
  const { t } = useTranslation();
  const exposureMatch = useSelector(selectMatch);
  const riskyLocationName = useSelector(selectRiskyLocationName);
  const checkInId = useSelector(selectCheckInId);

  const callbackRequested = useMemo(
    () => exposureMatch?.callbackRequested ?? false,
    [exposureMatch],
  );

  const dispatch = useDispatch();

  const onLinkPressed = useCallback(() => {
    if (navigationRef.current !== null) {
      navigationRef.current.navigate(DiaryScreen.DiaryEntry, {
        id: checkInId,
      });
    }
  }, [checkInId]);

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

  const locationAccessibilityLabel = !riskyLocationName
    ? [
        t("screens:dashboard:beenInContact:lastExposed"),
        moment(exposureMatch.checkInStartDate).format("DD MMMM YYYY"),
      ].join(" ")
    : [
        t("screens:dashboard:beenInContact:lastExposed"),
        moment(exposureMatch.checkInStartDate).format("DD MMMM YYYY"),
        t("screens:dashboard:beenInContact:riskyLocationAt"),
        riskyLocationName,
      ].join(" ");

  return (
    <Container callbackRequested={callbackRequested}>
      <HiddenAccessibilityTitle
        label={t("accessibility:dashboard:beenInContact")}
      />
      <CloseButton
        onDismiss={handleDismissPressed}
        accessibilityLabel={t("accessibility:button:close")}
      />
      <>
        {!!exposureMatch.checkInStartDate && (
          <HeadingText
            accessible
            accessibilityRole={riskyLocationName ? "button" : "none"}
            accessibilityLabel={locationAccessibilityLabel}
            accessibilityHint={
              riskyLocationName
                ? t("screens:dashboard:beenInContact:locationAccessibilityHint")
                : "none"
            }
          >
            {t("screens:dashboard:beenInContact:lastExposed")}
            {moment(exposureMatch.checkInStartDate).format("DD MMMM YYYY")}
            {riskyLocationName ? (
              <>
                {t("screens:dashboard:beenInContact:riskyLocationAt")}
                <LinkText onPress={onLinkPressed}>{riskyLocationName}</LinkText>
              </>
            ) : (
              ""
            )}
          </HeadingText>
        )}

        <HeaderContainer>
          <HeaderImage
            source={require("@assets/images/alert-location.png")}
            width={40}
            height={40}
          />
          <TitleText>
            {exposureMatch.appBannerTitle ||
              t("screens:dashboard:beenInContact:title")}
          </TitleText>
        </HeaderContainer>

        <BodyText>
          {exposureMatch.appBannerBody ||
            t("screens:dashboard:beenInContact:description")}
        </BodyText>

        <Buttons
          callbackEnabled={exposureMatch.appBannerRequestCallbackEnabled}
          callbackRequested={exposureMatch.callbackRequested}
          appBannerLinkLabel={exposureMatch.appBannerLinkLabel}
          onPressRequestCallback={handleRequestCallback}
          onPressMore={handlePressMore}
          secondaryButtonAccessibilityRole="link"
          secondaryButtonAccessibilityHint={t(
            "screens:dashboard:beenInContact:moreAccessibilityHint",
          )}
        />
      </>
    </Container>
  );
}
