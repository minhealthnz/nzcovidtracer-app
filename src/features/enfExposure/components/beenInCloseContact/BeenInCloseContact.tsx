import {
  HiddenAccessibilityTitle,
  ImageButton,
  Text,
  VerticalSpacing,
} from "@components/atoms";
import {
  HeadingText,
  PrimaryButton,
  SecondaryButton,
} from "@components/molecules/NotificationCard";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import useENFAlertCopy from "@features/enfExposure/hooks/useENFAlertCopy";
import { dismissEnfAlert, ENFAlertData } from "@features/enfExposure/reducer";
import {
  selectENFCallbackRequested,
  selectSetCallbackEnabled,
} from "@features/enfExposure/selectors";
import { defaultENFExpiresInDays } from "@features/enfExposure/util/defaultENFExpiresInDays";
import pupa from "pupa";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../../analytics";

const Container = styled.View<{ backgroundColor: string }>`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: ${(props) => props.backgroundColor};
`;

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

const CloseButton = styled(ImageButton)`
  padding: ${grid2x}px;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
`;

export interface BeenInCloseContactProps {
  enfAlert: ENFAlertData | undefined;
  onRequestCallback?(): void;
}

export function BeenInCloseContact({
  enfAlert,
  onRequestCallback,
}: BeenInCloseContactProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const callbackEnabled = useSelector(selectSetCallbackEnabled);
  const callbackRequested = useSelector(selectENFCallbackRequested);

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

  const alertText = useENFAlertCopy();

  const linkLabel = t("screens:dashboard:beenInCloseContact:more");

  const handleRequestCallback = useCallback(() => {
    if (!callbackRequested) {
      onRequestCallback?.();
    }
  }, [callbackRequested, onRequestCallback]);

  const showPrimaryButton = callbackEnabled || callbackRequested;

  const numberOfExposuresLabel = useMemo(() => {
    if (enfAlert == null) {
      return;
    }
    const alertExpiresInDays = defaultENFExpiresInDays(
      enfAlert.alertExpiresInDays,
    );
    return pupa(t("screens:dashboard:beenInCloseContact:numberOfExposures"), [
      alertExpiresInDays,
    ]);
  }, [enfAlert, t]);

  if (!enfAlert) {
    return null;
  }

  return (
    <Container
      backgroundColor={callbackRequested ? colors.lightPink : colors.orange}
    >
      <HiddenAccessibilityTitle
        label={t("accessibility:dashboard:beenInCloseContact")}
      />
      <CloseButton
        image={require("@assets/images/close.png")}
        onPress={handleDismissPressed}
        accessibilityLabel={t("accessibility:button:close")}
      />
      <>
        <HeadingText>{alertText}</HeadingText>
        {enfAlert.exposureCount > 1 && (
          <HeadingText>
            {`${enfAlert.exposureCount.toString()} ${numberOfExposuresLabel}`}
          </HeadingText>
        )}

        <HeaderContainer>
          <HeaderImage
            source={require("@assets/images/alert-enf.png")}
            width={40}
            height={40}
          />
          <TitleText>{enfAlert.alertTitle}</TitleText>
        </HeaderContainer>

        <BodyText>{enfAlert.alertMessage}</BodyText>

        {showPrimaryButton && (
          <>
            <VerticalSpacing height={20} />
            <PrimaryButton
              buttonColor={callbackRequested ? "green" : "black"}
              text={
                callbackRequested
                  ? t("screens:dashboard:beenInCloseContact:callbackRequested")
                  : t("screens:dashboard:beenInCloseContact:requestCallback")
              }
              onPress={callbackRequested ? undefined : handleRequestCallback}
              accessibilityRole={callbackRequested ? "none" : "button"}
            />
          </>
        )}

        <SecondaryButton
          accessibilityLabel={linkLabel}
          onPress={handlePressMore}
          accessibilityRole="link"
          text={linkLabel}
          accessibilityHint={t(
            "screens:dashboard:beenInCloseContact:moreAccessibilityHint",
          )}
          align={showPrimaryButton ? "center" : "left"}
        />
      </>
    </Container>
  );
}
