import { HeaderTextButton } from "@components/atoms/HeaderTextButton";
import { createLogger } from "@logger/createLogger";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import pupa from "pupa";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  loadingDidTimeout,
  navigateNext as navigateNextAction,
  skip as skipAction,
  unskip as unskipAction,
} from "./reducer";
import {
  selectIsLoading,
  selectScreens,
  selectScreenSteps,
  selectScreenTotalSteps,
} from "./selectors";
import { OnboardingFlowScreen, toSkippable } from "./types";
import { OnboardingStackParamList } from "./views/OnboardingStack";

const { logInfo } = createLogger("useOnboardingFlow");

export interface OnboardingFlow {
  next: OnboardingFlowScreen;
  navigateNext(): void;
  step?: number;
  totalSteps: number;
  stepText?: string;
  skip(): void;
  nextLoading: boolean;
}

export function useOnboardingFlow(
  props: StackScreenProps<OnboardingStackParamList, OnboardingFlowScreen>,
  current: OnboardingFlowScreen,
): OnboardingFlow {
  const screens = useSelector(selectScreens);
  const steps = useSelector(selectScreenSteps);
  const totalSteps = useSelector(selectScreenTotalSteps);
  const isLoading = useSelector(selectIsLoading);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const index = useMemo(() => screens.indexOf(current), [screens, current]);
  const next = screens[index + 1];
  const step = steps[index];

  const stepText = useMemo(() => {
    if (step == null) {
      return undefined;
    }
    return pupa(t("screenTitles:stepTemplate"), [step + 1, totalSteps]);
  }, [step, totalSteps, t]);

  // Set steps title
  useLayoutEffect(() => {
    if (stepText == null) {
      return;
    }
    props.navigation.setOptions({
      title: stepText,
    });
  }, [props.navigation, stepText]);

  const [pressed, setPressed] = useState(false);

  const gotoNext = useCallback(() => {
    logInfo(`navigateNext ${next ?? "empty"}`);
    if (next != null) {
      props.navigation.navigate(next);
    }
    dispatch(navigateNextAction(current));
  }, [props.navigation, dispatch, next, current]);

  const navigateNext = useCallback(() => {
    if (isLoading) {
      logInfo("navigateNext isLoading, waiting");
      setPressed(true);
      return;
    }
    gotoNext();
  }, [gotoNext, isLoading]);

  useEffect(() => {
    if (pressed && !isLoading) {
      logInfo("navigateNext isLoading false, navigating");
      setPressed(false);
      gotoNext();
    }
  }, [isLoading, pressed, gotoNext]);

  const maxWait = 5000;

  useEffect(() => {
    if (!pressed) {
      return;
    }
    const id = setTimeout(() => {
      if (isLoading) {
        dispatch(loadingDidTimeout());
      }
    }, maxWait);
    return () => clearTimeout(id);
  }, [pressed, dispatch, isLoading]);

  // Unskip on focus
  useFocusEffect(() => {
    unskip();
  });

  // Skip the current step
  const skip = useCallback(() => {
    const skippable = toSkippable(current);
    if (skippable) {
      dispatch(skipAction(skippable));
    }
    navigateNext();
  }, [current, dispatch, navigateNext]);

  // Unskip the current step
  const unskip = useCallback(() => {
    const skippable = toSkippable(current);
    if (skippable) {
      dispatch(unskipAction(skippable));
    }
  }, [current, dispatch]);

  // Create Skip header button
  useLayoutEffect(() => {
    const skippable = toSkippable(current);
    if (skippable) {
      props.navigation.setOptions({
        headerRight() {
          return (
            <HeaderTextButton
              title={t("headerButtons:skip")}
              onPress={skip}
              accessibilityLabel={t("headerButtons:skip")}
            />
          );
        },
      });
    }
  }, [props.navigation, stepText, current, skip, t]);

  const nextLoading = pressed && isLoading;

  return {
    next,
    navigateNext,
    step,
    totalSteps,
    stepText,
    skip,
    nextLoading,
  };
}
