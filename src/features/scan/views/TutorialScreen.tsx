import { Button, Text } from "@components/atoms";
import { HeaderBackButton } from "@components/atoms/HeaderBackButton";
import { HeaderCloseButton } from "@components/atoms/HeaderCloseButton";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { colors, fontFamilies, fontSizes, grid2x, grid4x } from "@constants";
import { setHasSeenScanTutorial } from "@features/diary/reducer";
import { isAndroid, isX } from "@lib/helpers";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { TFunction } from "i18next";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { ScanScreen } from "../screens";

const makeStepImages = () => {
  if (isAndroid) {
    return {
      step1: require("../assets/images/scan-tutorial-1-android.png"),
      step2: require("../assets/images/scan-tutorial-2-android.png"),
      step3: require("../assets/images/scan-tutorial-3-android.png"),
      step4: require("../assets/images/scan-tutorial-4-android.png"),
    };
  }

  if (isX) {
    return {
      step1: require("../assets/images/scan-tutorial-1-iphonex.png"),
      step2: require("../assets/images/scan-tutorial-2-iphonex.png"),
      step3: require("../assets/images/scan-tutorial-3-iphonex.png"),
      step4: require("../assets/images/scan-tutorial-4-iphonex.png"),
    };
  }

  return {
    step1: require("../assets/images/scan-tutorial-1-iphone.png"),
    step2: require("../assets/images/scan-tutorial-2-iphone.png"),
    step3: require("../assets/images/scan-tutorial-3-iphone.png"),
    step4: require("../assets/images/scan-tutorial-4-iphone.png"),
  };
};

const assets = {
  lock: require("@assets/icons/lock.png"),
  ...makeStepImages(),
};

const makeTutorialSteps = (t: TFunction) => [
  {
    image: assets.step1,
    title: t("screens:scanTutorial:step1:title"),
    description: t("screens:scanTutorial:step1:description"),
  },
  {
    image: assets.step2,
    title: t("screens:scanTutorial:step2:title"),
    description: t("screens:scanTutorial:step2:description"),
  },
  {
    image: assets.step3,
    title: t("screens:scanTutorial:step3:title"),
    description: t("screens:scanTutorial:step3:description"),
  },
  {
    image: assets.step4,
    title: t("screens:scanTutorial:step4:title"),
    description: t("screens:scanTutorial:step4:description"),
  },
];

const Container = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: ${grid4x}px;
  padding-top: ${grid2x}px;
  background-color: ${colors.white};
`;

const HeaderText = styled(Text)`
  font-size: ${fontSizes.xxLarge}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 26px;
  padding-top: 12px;
`;

const DescriptionContainer = styled.View`
  flex: 1;
  margin-bottom: ${grid2x}px;
`;

const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
`;

const ImageContainer = styled.View`
  padding-top: ${grid4x}px;
  background-color: ${colors.lightYellow};
  width: 100%;
  align-items: center;
`;

const BodyContainer = styled.View`
  flex: 1;
`;

interface Props
  extends StackScreenProps<MainStackParamList, ScanScreen.Tutorial> {
  onComplete: () => void;
}
export function TutorialScreen(props: Props) {
  const { t } = useTranslation();

  const TUTORIAL_STEPS = useMemo(() => makeTutorialSteps(t), [t]);

  const dispatch = useDispatch();

  const [currentTutorialStep, setTutorialStep] = useState(0);

  const { focusTitle } = useAccessibleTitle();

  const handlePrevPress = useCallback(() => {
    if (currentTutorialStep > 0) {
      setTutorialStep((currentStep) => currentStep - 1);
      focusTitle();
    }
  }, [currentTutorialStep, focusTitle]);

  const handleNextPress = () => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep((currentStep) => currentStep + 1);
      focusTitle();
    } else {
      handleFinishTutorial();
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setHasSeenScanTutorial());
    }, [dispatch]),
  );

  const handleFinishTutorial = useCallback(() => {
    props.navigation.navigate(TabScreen.RecordVisit);
    setTutorialStep(0);
  }, [setTutorialStep, props.navigation]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        if (currentTutorialStep > 0) {
          return <HeaderBackButton onPress={handlePrevPress} />;
        }
        return null;
      },
      headerRight: () => (
        <HeaderCloseButton
          testID="tutorial.close"
          onPress={handleFinishTutorial}
        />
      ),
    });
  }, [
    props.navigation,
    currentTutorialStep,
    handlePrevPress,
    handleFinishTutorial,
  ]);

  return (
    <Container contentContainerStyle={styles.scrollViewContainer}>
      <BodyContainer>
        <ImageContainer accessible={false}>
          <Image source={TUTORIAL_STEPS[currentTutorialStep].image} />
        </ImageContainer>
        <ContentContainer>
          <HeaderText maxFontSizeMultiplier={1.5}>
            {TUTORIAL_STEPS[currentTutorialStep].title}
          </HeaderText>
          <DescriptionContainer>
            <Description maxFontSizeMultiplier={1.5}>
              {TUTORIAL_STEPS[currentTutorialStep].description}
            </Description>
          </DescriptionContainer>

          <Button text="Next" onPress={handleNextPress} />
        </ContentContainer>
      </BodyContainer>

      <Disclaimer text={t("components:diaryDisclaimer:disclaimer")} />
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
});
