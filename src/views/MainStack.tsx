import { HeaderBackImage } from "@components/atoms/HeaderBackImage";
import {
  DebugScreenParams,
  useDebugScreens,
} from "@features/debugging/hooks/useDebugScreens";
import { useDiaryScreens } from "@features/diary/hooks/useDiaryScreens";
import { DiaryScreenParams } from "@features/diary/screens";
import { useENFScreens } from "@features/enf/hooks/useENFScreens";
import { ENFScreenParams } from "@features/enf/screens";
import {
  RequestCallbackScreenParams,
  useRequestCallbackScreens,
} from "@features/exposure/hooks/useRequestCallbackScreens";
import { useNHIScreens } from "@features/nhi/hooks/useNHIScreens";
import { NHIScreenParams } from "@features/nhi/screens";
import { setHasSeenLockCode } from "@features/onboarding/reducer";
import { OnboardingScreen } from "@features/onboarding/screens";
import { selectHasSeenLockCode } from "@features/onboarding/selectors";
import { OTPScreenParams } from "@features/otp/screens";
import { useOtpScreens } from "@features/otp/useOtpScreens";
import { useScanScreens } from "@features/scan/hooks/useScanScreens";
import { ScanScreenParams } from "@features/scan/screens";
import { TutorialScreenParams } from "@features/scan/views/TutorialNavigator";
import { createLogger } from "@logger/createLogger";
import { useHeaderOptions } from "@navigation/hooks/useHeaderOptions";
import { headerOptions } from "@navigation/options";
import { useFocusEffect } from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
  TransitionPresets,
} from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { disableAnimations } from "../config";
import { ModalStackParamList } from "./ModalStack";
import { TabScreen } from "./screens";
import { TabNavigator, TabScreenParams } from "./TabNavigator";

export type MainStackParamList = ScanScreenParams &
  DiaryScreenParams &
  TabScreenParams &
  TutorialScreenParams &
  OTPScreenParams &
  NHIScreenParams &
  ENFScreenParams &
  DebugScreenParams &
  RequestCallbackScreenParams & {
    [TabScreen.Navigator]: any;
  } & ModalStackParamList;

const Stack = createStackNavigator<MainStackParamList>();

export interface MainStackProps extends StackScreenProps<MainStackParamList> {}

const { logInfo } = createLogger("MainStack.tsx");

export function MainStack(props: MainStackProps) {
  const hasSeenLockCode = useSelector(selectHasSeenLockCode);
  const shouldShowLockCode = !hasSeenLockCode;

  const dispatch = useDispatch();

  const shownScreen = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (shownScreen.current) {
        return;
      }
      shownScreen.current = true;
      if (shouldShowLockCode) {
        logInfo("show lock code");
        dispatch(setHasSeenLockCode());
        props.navigation.navigate(OnboardingScreen.LockCodeNavigator);
      }
    }, [dispatch, props.navigation, shouldShowLockCode]),
  );

  const tabHeaderOptions = useHeaderOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOptions,
        headerBackImage: HeaderBackImage,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: !disableAnimations,
      }}
    >
      <Stack.Screen
        name={TabScreen.Navigator}
        component={TabNavigator}
        options={tabHeaderOptions}
      />
      {useScanScreens()}
      {useDiaryScreens()}
      {useOtpScreens()}
      {useNHIScreens()}
      {useENFScreens()}
      {useRequestCallbackScreens()}
      {useDebugScreens()}
    </Stack.Navigator>
  );
}
