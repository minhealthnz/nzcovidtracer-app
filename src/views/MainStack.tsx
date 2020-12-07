import { DebugScreen } from "@features/debugging/screens";
import { DebugMenuStack } from "@features/debugging/views/DebugMenuStack";
import { DiaryScreen } from "@features/diary/screens";
import { DiaryStack } from "@features/diary/views/DiaryStack";
import { ENFScreen } from "@features/enf/screens";
import { ENFNavigator } from "@features/enf/views/ENFNavigator";
import { RequestCallbackScreen } from "@features/exposure/screens";
import RequestCallbackStack from "@features/exposure/views/RequestCallbackStack";
import { NHIScreen } from "@features/nhi/screens";
import { NHINavigator } from "@features/nhi/views/NHINavigator";
import { setHasSeenLockCode } from "@features/onboarding/reducer";
import { OnboardingScreen } from "@features/onboarding/screens";
import { selectHasSeenLockCode } from "@features/onboarding/selectors";
import { ProfileScreen } from "@features/profile/screens";
import { ProfileNavigator } from "@features/profile/views/ProfileNavigator";
import { ScanScreen } from "@features/scan/screens";
import { ScanNavigator } from "@features/scan/views/ScanNavigator";
import { createLogger } from "@logger/createLogger";
import { useFocusEffect } from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
  TransitionPresets,
} from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import config, { disableAnimations } from "../config";
import { ModalStackParamList } from "./ModalStack";
import { MainStackScreen, TabScreen } from "./screens";
import { TabNavigator } from "./TabNavigator";

export type MainStackParamList = {
  // TODO Tidy up types
  [ScanScreen.Navigator]: any;
  [ProfileScreen.Navigator]: any;
  [NHIScreen.Navigator]: any;
  [DebugScreen.Navigator]: any;
  [DiaryScreen.Navigator]: any;
  [TabScreen.Navigator]: any;
  [RequestCallbackScreen.Navigator]: any;
  [ENFScreen.Navigator]: any;
} & ModalStackParamList;

const Stack = createStackNavigator<MainStackParamList>();

export interface MainStackProps
  extends StackScreenProps<ModalStackParamList, MainStackScreen.Navigator> {}

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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !disableAnimations,
        headerTitleAllowFontScaling: false,
        headerBackAllowFontScaling: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name={TabScreen.Navigator} component={TabNavigator} />
      <Stack.Screen name={ScanScreen.Navigator} component={ScanNavigator} />
      <Stack.Screen
        name={ProfileScreen.Navigator}
        component={ProfileNavigator}
      />
      <Stack.Screen
        name={RequestCallbackScreen.Navigator}
        component={RequestCallbackStack}
      />
      <Stack.Screen name={NHIScreen.Navigator} component={NHINavigator} />
      <Stack.Screen name={ENFScreen.Navigator} component={ENFNavigator} />
      {config.IsDev && (
        <Stack.Screen name={DebugScreen.Navigator} component={DebugMenuStack} />
      )}
      <Stack.Screen name={DiaryScreen.Navigator} component={DiaryStack} />
    </Stack.Navigator>
  );
}
