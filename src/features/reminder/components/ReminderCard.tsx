import { HiddenAccessibilityTitle, Text } from "@components/atoms";
import { CloseButton } from "@components/atoms/CloseButton";
import {
  PrimaryButton,
  SecondaryButton,
} from "@components/molecules/NotificationCard";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { ProfileScreen } from "@features/profile/screens";
import { isSmallScreen } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { recordAnalyticEvent } from "../../../analytics";
import { ReminderEvents } from "../events";
import { dismissInAppReminder } from "../reducer";
import { selectCurrentlyDisplayedInAppReminder } from "../selectors";

const assets = {
  illustration: require("../assets/images/reminder-illustration.png"),
};

const Card = styled.View`
  background-color: ${colors.paleBlue};
  flex-direction: row;
`;

const TextContainer = styled.View`
  flex-direction: column;
  padding-vertical: ${grid2x}px;
  padding-left: ${grid2x}px;
  flex: 1;
`;

const Date = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  line-height: 16px;
`;

const Title = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  color: ${colors.primaryBlack};
  padding-top: 12px;
  line-height: 26px;
`;

const Body = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  line-height: 20px;
`;

const ButtonView = styled.View`
  flex-direction: row;
  margin-top: ${grid2x}px;
`;

const ButtonViewSmallScreen = styled.View`
  flex-direction: column;
  margin-top: ${grid2x}px;
  align-self: flex-start;
`;

const DiaryButton = styled(PrimaryButton)`
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: ${grid}px ${grid2x}px;
`;

const DiaryButtonSmallScreen = styled(PrimaryButton)`
  justify-content: center;
  align-items: center;
  height: auto;
  width: auto;
  padding: ${grid}px ${grid2x}px;
  margin-bottom: ${grid2x}px;
`;

const ManageButton = styled(SecondaryButton)`
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  height: auto;
  padding: 0 ${grid2x}px;
`;

const ManageButtonSmallScreen = styled(SecondaryButton)`
  justify-content: center;
  align-items: flex-start;
  height: auto;
  padding: 0;
  padding-right: ${grid2x}px;
`;

const ManageButtonSingle = styled(SecondaryButton)`
  justify-content: flex-start;
  align-items: center;
  height: auto;
  padding: 4px 0px 8px 0px;
`;

const IllustrationContainer = styled.View`
  justify-content: flex-end;
`;

const Illustration = styled.Image`
  margin-right: 3px;
  margin-left: -3px;
`;

export interface ReminderCardProps {
  isDashboard?: boolean;
}

export function ReminderCard(props: ReminderCardProps) {
  const { isDashboard } = props;
  const [fontScale, setFontScale] = useState(1);
  useFocusEffect(() => {
    DeviceInfo.getFontScale().then((scale) => setFontScale(scale));
  });
  const { t } = useTranslation();
  const reminder = useSelector(selectCurrentlyDisplayedInAppReminder);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const onPressViewDiary = useCallback(() => {
    recordAnalyticEvent(ReminderEvents.ReminderViewDiaryPressed);
    navigation.navigate(DiaryScreen.Diary);
  }, [navigation]);
  const onPressManageNotifications = useCallback(() => {
    recordAnalyticEvent(ReminderEvents.ReminderManageNotificationsPressed);
    navigation.navigate(ProfileScreen.Settings);
  }, [navigation]);
  const onPressClose = useCallback(() => {
    recordAnalyticEvent(ReminderEvents.ReminderDismissed, {
      attributes: {
        screen: isDashboard ? "dashboard" : "diary",
      },
    });
    dispatch(dismissInAppReminder());
  }, [dispatch, isDashboard]);
  const date = useMemo(
    () => !!reminder && moment(reminder.dateTime).format("DD MMMM YYYY"),
    [reminder],
  );
  const renderButtons = useCallback(() => {
    if (isSmallScreen(Dimensions.get("window").width) || fontScale > 1) {
      return (
        <ButtonViewSmallScreen>
          {isDashboard ? (
            <>
              <DiaryButtonSmallScreen
                text={t("screens:dashboard:cards:reminder:viewDiary")}
                onPress={onPressViewDiary}
              />
              <ManageButtonSmallScreen
                text={t("screens:dashboard:cards:reminder:manageNotifications")}
                onPress={onPressManageNotifications}
              />
            </>
          ) : (
            <ManageButtonSingle
              text={t("screens:dashboard:cards:reminder:manageNotifications")}
              onPress={onPressManageNotifications}
              accessibilityLabel={t(
                "screens:dashboard:cards:reminder:manageNotifications",
              )}
              accessibilityRole="button"
            />
          )}
        </ButtonViewSmallScreen>
      );
    }
    return (
      <ButtonView>
        {isDashboard ? (
          <>
            <DiaryButton
              text={t("screens:dashboard:cards:reminder:viewDiary")}
              onPress={onPressViewDiary}
            />
            <ManageButton
              text={t("screens:dashboard:cards:reminder:manageNotifications")}
              onPress={onPressManageNotifications}
              accessibilityLabel={t(
                "screens:dashboard:cards:reminder:manageNotifications",
              )}
              accessibilityRole="button"
            />
          </>
        ) : (
          <ManageButtonSingle
            text={t("screens:dashboard:cards:reminder:manageNotifications")}
            onPress={onPressManageNotifications}
            accessibilityLabel={t(
              "screens:dashboard:cards:reminder:manageNotifications",
            )}
            accessibilityRole="button"
          />
        )}
      </ButtonView>
    );
  }, [isDashboard, onPressManageNotifications, onPressViewDiary, t, fontScale]);
  if (!reminder) {
    return null;
  }
  return (
    <Card>
      <HiddenAccessibilityTitle
        label={t("screens:dashboard:cards:reminder:hiddenAccessibilityLabel")}
      />
      <TextContainer>
        <Date>{date}</Date>
        <Title>
          {isDashboard ? reminder.dashboardTitle : reminder.diaryTitle}
        </Title>
        <Body>{isDashboard ? reminder.dashboardBody : reminder.diaryBody}</Body>
        {renderButtons()}
      </TextContainer>
      <IllustrationContainer>
        <CloseButton onDismiss={onPressClose} />
        <Illustration source={assets.illustration} />
      </IllustrationContainer>
    </Card>
  );
}
