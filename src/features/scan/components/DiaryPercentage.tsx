import { Tip, TipText } from "@components/atoms/Tip";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { DiaryScreen } from "@features/diary/screens";
import { selectCountActiveDays } from "@features/diary/selectors";
import { navigationRef } from "@navigation/navigation";
import pupa from "pupa";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const Container = styled(TouchableOpacity)`
  flex-direction: row;
`;
const TextBox = styled(View)`
  flex: 1;
  flex-direction: column;
  padding: 12px ${grid2x}px ${grid2x}px ${grid2x}px;
  background-color: ${colors.white};
`;

const TopTextView = styled(View)`
  align-items: center;
  flex-direction: row;
  margin-top: -5px;
`;

const TopText = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 30px;
  color: ${colors.primaryGray};
`;

const MiddleText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxxxLarge}px;
  padding-top: 30px;
  line-height: 10px;
`;

const InnerText = styled(Text)`
  font-size: ${fontSizes.normal}px;
`;

const BottomText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryGray};
`;

const PercentageBox = styled.View`
  width: 90px;
  background-color: ${colors.lightYellow};
  justify-content: center;
  align-items: center;
`;

const DiaryComplete = styled(Image)`
  max-width: 100%;
  max-height: 100%;
`;

const DiaryCompleteBox = styled.View`
  width: 90px;
  background-color: ${colors.yellow};
  justify-content: center;
  align-items: center;
`;

const Chevron = styled(Image)`
  margin-left: 5px;
  width: 8.5px;
  height: 14px;
`;

const Diary = styled.Image`
  bottom: 1.5px;
  width: 22px;
  height: 20px;
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

  const renderPercentageBox = () => {
    if (numberOfDiaryEntriesPercentage === 100) {
      return (
        <DiaryCompleteBox>
          <DiaryComplete source={assets.diaryComplete} resizeMode="contain" />
        </DiaryCompleteBox>
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
  };

  return (
    <>
      <Container
        onPress={handlePress}
        accessibilityLabel={percentageAccessibilityLabel}
        accessibilityHint={t(
          "components:diaryPercentage:percentageAccessibilityHint",
        )}
      >
        <TextBox>
          <TopTextView>
            <TopText>{t("components:diaryPercentage:topText")}</TopText>
            <Chevron source={assets.chevron} />
          </TopTextView>
          <MiddleText>
            {numberOfDiaryCompleteDays}
            <InnerText>{t("components:diaryPercentage:middleText")}</InnerText>
          </MiddleText>
          <BottomText>{t("components:diaryPercentage:bottomText")}</BottomText>
        </TextBox>
        {renderPercentageBox()}
      </Container>
      <Tip backgroundColor={colors.paleYellow}>
        <TipText lineHeight={20} fontSize={14}>
          {t("components:diaryPercentage:tip")}
        </TipText>
      </Tip>
    </>
  );
}
