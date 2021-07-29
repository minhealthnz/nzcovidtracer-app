import { Text, VerticalSpacing } from "@components/atoms";
import { HeaderBackButton } from "@components/atoms/HeaderBackButton";
import { HeaderCloseButton } from "@components/atoms/HeaderCloseButton";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes } from "@constants";
import { setHasSeenScanTutorial } from "@features/diary/reducer";
import { commonStyles } from "@lib/commonStyles";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { TFunction } from "i18next";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { ScanScreen } from "../screens";

const makeStepImages = () => {
  return {
    step1: require("../assets/images/scan-tutorial-1.png"),
    step2: require("../assets/images/scan-tutorial-2.png"),
    step3: require("../assets/images/scan-tutorial-3.png"),
    step4: require("../assets/images/scan-tutorial-4.png"),
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
    tipBold: t("screens:scanTutorial:step1:tipBold"),
    tip: t("screens:scanTutorial:step1:tip"),
    imageAccessibilityLabel: t(
      "screens:scanTutorial:step1:imageAccessibilityLabel",
    ),
  },
  {
    image: assets.step2,
    title: t("screens:scanTutorial:step2:title"),
    description: t("screens:scanTutorial:step2:description"),
    tipBold: t("screens:scanTutorial:step2:tipBold"),
    tip: t("screens:scanTutorial:step2:tip"),
    imageAccessibilityLabel: t(
      "screens:scanTutorial:step2:imageAccessibilityLabel",
    ),
  },
  {
    image: assets.step3,
    title: t("screens:scanTutorial:step3:title"),
    description: t("screens:scanTutorial:step3:description"),
    tipBold: t("screens:scanTutorial:step3:tipBold"),
    tip: t("screens:scanTutorial:step3:tip"),
    imageAccessibilityLabel: t(
      "screens:scanTutorial:step3:imageAccessibilityLabel",
    ),
  },
  {
    image: assets.step4,
    title: t("screens:scanTutorial:step4:title"),
    description: t("screens:scanTutorial:step4:description"),
    imageAccessibilityLabel: t(
      "screens:scanTutorial:step4:imageAccessibilityLabel",
    ),
  },
];

const BoldTip = styled(Text)`
font-size: ${fontSizes.normal}px
font-family: ${fontFamilies["open-sans-bold"]};
color: ${colors.primaryBlack};
`;

interface Props
  extends StackScreenProps<MainStackParamList, ScanScreen.Tutorial> {
  onComplete: () => void;
}
export function TutorialScreen(props: Props) {
  const { t } = useTranslation();

  const formRef = useRef<FormV2Handle | null>(null);

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

  const handleButtonPress = () => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep((currentStep) => currentStep + 1);
      focusTitle();
    } else {
      handleFinishTutorial();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      formRef.current?.scrollTo({ x: 0, y: 0 });
    }, 0);
  }, [currentTutorialStep]);

  const buttonText = useMemo(() => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      return t("screens:scanTutorial:next");
    } else {
      return t("screens:scanTutorial:okay");
    }
  }, [t, currentTutorialStep, TUTORIAL_STEPS.length]);

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

  const hasBoldTip = !!TUTORIAL_STEPS[currentTutorialStep].tipBold;
  const hasTip = !!TUTORIAL_STEPS[currentTutorialStep].tip;

  return (
    <FormV2
      ref={formRef}
      headerImage={TUTORIAL_STEPS[currentTutorialStep].image}
      headerBackgroundColor={colors.lightGrey}
      headerImageAccessibilityLabel={
        TUTORIAL_STEPS[currentTutorialStep].imageAccessibilityLabel
      }
      headerImageStyle={commonStyles.headerImage}
      buttonText={buttonText}
      onButtonPress={handleButtonPress}
      snapButtonsToBottom={true}
      heading={TUTORIAL_STEPS[currentTutorialStep].title}
      description={TUTORIAL_STEPS[currentTutorialStep].description}
    >
      {hasTip && (
        <>
          <Tip backgroundColor={colors.lightYellow}>
            <TipText>
              {hasBoldTip && (
                <BoldTip>{TUTORIAL_STEPS[currentTutorialStep].tipBold}</BoldTip>
              )}
              {TUTORIAL_STEPS[currentTutorialStep].tip}
            </TipText>
          </Tip>

          <VerticalSpacing height={20} />
        </>
      )}
    </FormV2>
  );
}
