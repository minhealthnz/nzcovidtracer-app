import { Text, VerticalSpacing } from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { Card } from "@components/molecules/Card";
import { colors, fontSizes, grid2x } from "@constants";
import {
  addressLink,
  contactDetailsLink,
  contactLink,
  copyrightLink,
  feedbackLink,
  helpLink,
  privacyLink,
  termsOfUseLink,
} from "@constants";
import { selectUser } from "@domain/user/selectors";
import { DebugScreen } from "@features/debugging/screens";
import { DiaryScreen } from "@features/diary/screens";
import { selectHasOldDiary } from "@features/diary/selectors";
import { ENFScreen } from "@features/enf/screens";
import { NHIScreen } from "@features/nhi/screens";
import { createOTPSession } from "@features/otp/reducer";
import { OTPScreen } from "@features/otp/screens";
import { Link } from "@features/profile/components/Link";
import { selectIsVerified } from "@features/verification/selectors";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { nanoid } from "@reduxjs/toolkit";
import { TabScreen } from "@views/screens";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import { useExposure } from "react-native-exposure-notification-service";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import config from "../../../config";
import { testable } from "../../../testable";
import { gray } from "../colors";
import { ProfileScreen } from "../screens";
import { ProfileStackParamList } from "./ProfileNavigator";

const assets = {
  diary: require("../assets/icons/diary.png"),
  details: require("../assets/icons/details.png"),
  location: require("../assets/icons/location.png"),
  nhi: require("../assets/icons/nhi.png"),
  send: require("../assets/icons/send.png"),
};

const Container = testable(styled.ScrollView`
  background-color: ${colors.lightGrey};
  padding: 0 ${grid2x}px;
`);

const Version = styled(Text)`
  color: ${gray};
  padding: 0 8px 16px 8px;
`;

interface ProfileProps
  extends BottomTabScreenProps<ProfileStackParamList, TabScreen.MyData> {}

export default function Profile(props: ProfileProps) {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser);
  const hasNHI = useMemo(() => currentUser?.nhi, [currentUser]);
  const dispatch = useDispatch();
  const hasOldDiary = useSelector(selectHasOldDiary);
  const verified = useSelector(selectIsVerified);
  const { supported: enfSupported } = useExposure();

  const showShareENF = enfSupported && verified;

  useAccessibleTitle();

  return (
    <Container testID="screens:profile">
      <VerticalSpacing height={16} />
      <Card
        headerImage={assets.diary}
        title={t("screens:profile:viewDiary")}
        onPress={() => {
          props.navigation.navigate(DiaryScreen.Navigator, {
            screen: DiaryScreen.Diary,
          });
        }}
      />
      {hasOldDiary && <Divider />}
      {hasOldDiary && (
        <Card
          headerImage={assets.diary}
          title={t("screens:profile:recoverDiary")}
          onPress={() => {
            const sessionId = nanoid();
            dispatch(
              createOTPSession({
                id: sessionId,
                type: "viewDiary",
                verifyEmailScreenTitle: t("screenTitles:chooseOldDiary"),
                enterEmailScreenTitle: t("screenTitles:chooseOldDiary"),
                mfaErrorHandling: "ignore",
              }),
            );
            props.navigation.navigate(DiaryScreen.Navigator, {
              screen: OTPScreen.EnterEmail,
              params: {
                sessionId,
              },
            });
          }}
        />
      )}
      <VerticalSpacing height={16} />
      <Card
        headerImage={assets.details}
        title={t("screens:profile:contactDetails")}
        description={t("screens:profile:contactDetailsDescription")}
        onPress={() => {
          Linking.openURL(contactDetailsLink);
        }}
      />
      <Divider />
      <Card
        headerImage={assets.location}
        title={t("screens:profile:address")}
        description={t("screens:profile:addressDescription")}
        onPress={() => {
          Linking.openURL(addressLink);
        }}
      />
      <Divider />
      <Card
        headerImage={assets.nhi}
        testID="profile:nhi"
        title={
          hasNHI
            ? t("screens:profile:nhiDetailsHasNHI")
            : t("screens:profile:nhiDetails")
        }
        description={
          hasNHI
            ? t("screens:profile:nhiDescriptionHasNHI")
            : t("screens:profile:nhiDescription")
        }
        onPress={() => {
          if (hasNHI) {
            recordAnalyticEvent(AnalyticsEvent.ViewNHIFromMyProfile);
          }

          props.navigation.navigate(NHIScreen.Navigator, {
            screen: hasNHI ? NHIScreen.View : NHIScreen.Privacy,
          });
        }}
      />
      <VerticalSpacing height={16} />
      <Card
        headerImage={assets.send}
        testID="profile:shareDiary"
        title={t("screens:profile:shareDiary")}
        onPress={() => {
          props.navigation.navigate(ProfileScreen.Navigator, {
            screen: ProfileScreen.ShareDiary,
          });
        }}
      />
      {showShareENF && (
        <>
          <Divider />
          <Card
            headerImage={assets.send}
            testID="profile:shareBluetooth"
            title={t("screens:profile:shareBluetooth")}
            onPress={() => {
              recordAnalyticEvent(AnalyticsEvent.ENFShareCodesMenuItemPressed);
              props.navigation.navigate(ENFScreen.Navigator, {
                screen: ENFScreen.Share,
              });
            }}
          />
        </>
      )}
      <VerticalSpacing height={16} />
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
          onPress={() => {
            props.navigation.navigate(DebugScreen.Navigator);
          }}
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
    </Container>
  );
}
