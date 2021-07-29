import { Text } from "@components/atoms";
import {
  StatusCard,
  StatusView,
  StatusViewContainer,
} from "@components/atoms/StatusCard";
import { colors, fontFamilies, fontSizes } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { selectCountActiveDays } from "@features/diary/selectors";
import { navigationRef } from "@navigation/navigation";
import pupa from "pupa";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProgressCircle from "react-native-progress-circle";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const PercentageBox = styled.View`
  width: 90px;
  background-color: ${colors.lightYellow};
  justify-content: center;
  align-items: center;
`;

const Diary = styled.Image`
  bottom: 1.5px;
  width: 22px;
  height: 20px;
`;

const StatusText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
`;

const BoldStatusText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxxxLarge}px;
`;

const assets = {
  chevron: require("@assets/icons/percentage-chevron-right.png"),
  diary: require("@assets/icons/diary-percentage-diary.png"),
  diaryComplete: require("@assets/images/diary-complete.png"),
};

export interface DiaryPercentageProps {
  onPress?(): void;
}

export function DiaryPercentage({ onPress }: DiaryPercentageProps) {
  const numberOfDiaryEntries = useSelector(selectCountActiveDays);
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }

    if (navigationRef.current !== null) {
      navigationRef.current.navigate(DiaryScreen.Diary);
    }
  }, [onPress]);

  const totalDairyDays = 14;

  const numberOfDiaryEntriesPercentage = useMemo(() => {
    const percentage = Math.ceil((numberOfDiaryEntries / totalDairyDays) * 100);
    return Math.min(100, percentage);
  }, [numberOfDiaryEntries]);

  const numberOfDiaryCompleteDays = useMemo(() => {
    return Math.min(totalDairyDays, numberOfDiaryEntries);
  }, [numberOfDiaryEntries]);

  const percentageAccessibilityLabel = pupa(
    t("components:diaryPercentage:percentageAccessibilityLabel"),
    [numberOfDiaryCompleteDays],
  );

  const status = useMemo(() => {
    if (numberOfDiaryEntriesPercentage === 100) {
      return (
        <StatusViewContainer backgroundColor={colors.yellow}>
          <StatusView source={assets.diaryComplete} resizeMode="contain" />
        </StatusViewContainer>
      );
    } else {
      return (
        <PercentageBox>
          <ProgressCircle
            percent={numberOfDiaryEntriesPercentage}
            radius={28}
            borderWidth={6.5}
            shadowColor={colors.white}
            color={colors.yellow}
            bgColor={colors.lightYellow}
          >
            <Diary source={assets.diary} />
          </ProgressCircle>
        </PercentageBox>
      );
    }
  }, [numberOfDiaryEntriesPercentage]);

  const renderStatusText = useMemo(() => {
    return (
      <BoldStatusText>
        {numberOfDiaryCompleteDays}
        <StatusText>{t("components:diaryPercentage:middleText")}</StatusText>
      </BoldStatusText>
    );
  }, [numberOfDiaryCompleteDays, t]);

  return (
    <StatusCard
      title={t("components:diaryPercentage:topText")}
      description={t("components:diaryPercentage:bottomText")}
      tipText={t("components:diaryPercentage:tip")}
      onPress={handlePress}
      accessibilityLabel={percentageAccessibilityLabel}
      accessibilityHint={t(
        "components:diaryPercentage:percentageAccessibilityHint",
      )}
      renderStatusView={status}
      renderStatusText={renderStatusText}
    />
  );
}
