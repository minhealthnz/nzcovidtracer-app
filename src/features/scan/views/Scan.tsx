import { Button, Text, VerticalSpacing } from "@components/atoms";
import { colors } from "@constants";
import { selectUserId } from "@domain/user/selectors";
import { requestCameraPermission } from "@features/device/reducer";
import {
  selectCameraPermission,
  selectHasRequestedCameraPermission,
} from "@features/device/selectors";
import { addEntry, setHasSeenScanTutorial } from "@features/diary/reducer";
import { DiaryScreen } from "@features/diary/screens";
import { selectHasSeenScanTutorial } from "@features/diary/selectors";
import { DiaryEntry } from "@features/diary/types";
import { isAndroid } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { BarcodeMask } from "@nartc/react-native-barcode-mask";
import { useAppState } from "@react-native-community/hooks";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { useCavy } from "cavy";
import { Base64 } from "js-base64";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, InteractionManager, StyleSheet, Vibration } from "react-native";
import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import CameraNotAuthorized from "../CameraNotAuthorized";
import { ScanScreen } from "../screens";
import { createDiaryEntry } from "./helpers";

const { logInfo, logWarning, logError } = createLogger("Scan.tsx");

const MIN_INTERVAL_BETWEEN_SCANS = 2500;

const BYPASS_ERROR_ALERT_AFTER = 7500;

const TIME_TO_UNMOUNT_CAMERA_AFTER = 5000;

const hapticFeedBackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export interface QRScanData {
  typ: string;
  gln: string;
  opn: string;
  adr: string;
  ver: string;
}

function isQRScanDataValid(qrScanData: QRScanData): boolean {
  const isInvalid =
    qrScanData.typ == null ||
    typeof qrScanData.typ !== "string" ||
    qrScanData.gln == null ||
    typeof qrScanData.gln !== "string" ||
    qrScanData.opn == null ||
    typeof qrScanData.opn !== "string" ||
    qrScanData.adr == null ||
    typeof qrScanData.adr !== "string" ||
    qrScanData.ver == null ||
    typeof qrScanData.ver !== "string";

  return !isInvalid;
}

const assets = {
  flashLightOn: require("@assets/icons/flashlight-on.png"),
  flashLightOff: require("@assets/icons/flashlight-off.png"),
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.primaryBlack};
`;

const Pending = styled.View`
  flex: 1;
  background-color: ${colors.primaryBlack};
`;

const FooterContainer = styled.View`
  background-color: ${colors.white};
  padding: 20px;
  width: 100%;
  align-items: flex-start;
`;

const Instruction = styled(Text)`
  padding-left: 1px;
`;

const FlashLightIconContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  padding-right: 20px;
  padding-bottom: 20px;
`;

const FlashLightIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

interface Props
  extends StackScreenProps<MainStackParamList, TabScreen.RecordVisit> {}

export function Scan(props: Props) {
  const cameraRef = useRef<RNCamera>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentUserId = useSelector(selectUserId);
  const lastScannedAt = useRef<Date>();
  const generateTestHook = useCavy();
  const isFocused = useIsFocused();
  const hasSeenScanTutorial = useSelector(selectHasSeenScanTutorial);
  const [isCameraMounted, setIsCameraMounted] = useState(false);
  const cameraPermission = useSelector(selectCameraPermission);
  const [flashLightMode, setFlashLightMode] = useState(
    RNCamera.Constants.FlashMode.off,
  );

  const handleFlashLightMode = useCallback(() => {
    if (flashLightMode === RNCamera.Constants.FlashMode.off) {
      setFlashLightMode(RNCamera.Constants.FlashMode.torch);
    } else {
      setFlashLightMode(RNCamera.Constants.FlashMode.off);
    }
  }, [flashLightMode]);

  const canScanBarcode = useCallback(() => {
    const currentTimeStamp = new Date().getTime();
    const difference =
      currentTimeStamp - (lastScannedAt.current?.getTime() ?? 0);

    return difference > MIN_INTERVAL_BETWEEN_SCANS;
  }, []);

  const showError = useCallback(
    (title: string, message?: string) => {
      logWarning(`Scan failed: ${message}`);

      if (isAndroid) {
        Vibration.vibrate([0, 200, 100, 200]);
      } else {
        ReactNativeHapticFeedback.trigger(
          "notificationError",
          hapticFeedBackOptions,
        );
      }

      lastScannedAt.current = new Date(
        new Date().getTime() + BYPASS_ERROR_ALERT_AFTER,
      );

      Alert.alert(
        title,
        message,
        [
          {
            text: t("common:ok"),
            onPress() {
              lastScannedAt.current = undefined;
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
    [t],
  );

  useFocusEffect(
    useCallback(() => {
      if (hasSeenScanTutorial) {
        return;
      }
      /**
       * Technically, don't need this action as the tutorial screen dispatches this on focus
       * It's to prevent the scan screen from being stuck
       */
      dispatch(setHasSeenScanTutorial());
      props.navigation.navigate(ScanScreen.TutorialNavigator);
    }, [props.navigation, dispatch, hasSeenScanTutorial]),
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (hasSeenScanTutorial && cameraPermission === "denied") {
          dispatch(requestCameraPermission());
        }
      });
      return () => task.cancel();
    }, [cameraPermission, dispatch, hasSeenScanTutorial]),
  );

  useEffect(() => {
    if (!isCameraMounted && isFocused) {
      logInfo("remount camera");
      setIsCameraMounted(true);
      return;
    }
  }, [isCameraMounted, isFocused]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isFocused) {
        logInfo("unmount camera");
        setIsCameraMounted(false);
      }
    }, TIME_TO_UNMOUNT_CAMERA_AFTER);

    return () => clearTimeout(timeoutId);
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.Scan);
    }, []),
  );

  const saveEntryAsync = useCallback(
    async (entry: DiaryEntry) => {
      try {
        // TODO Create a separate interface for inserts
        if (entry.id == null) {
          throw new Error("Entry has no id!");
        }

        try {
          await dispatch(
            addEntry({
              entry,
            }),
          ).then(unwrapResult);

          if (isAndroid) {
            Vibration.vibrate([0, 600]);
          } else {
            ReactNativeHapticFeedback.trigger(
              "notificationSuccess",
              hapticFeedBackOptions,
            );
          }

          props.navigation.navigate(ScanScreen.Recorded, {
            id: entry.id,
          });
        } catch (err) {
          logError(err);
          props.navigation.navigate(ScanScreen.ScanNotRecorded);
        }
      } catch (err) {
        showError(t("errors:generic"));
        logError(err);
      }
    },
    [dispatch, props.navigation, showError, t],
  );

  const onManualPress = useCallback(() => {
    if (!canScanBarcode()) {
      return;
    }

    props.navigation.navigate(DiaryScreen.AddEntryManually);
  }, [props.navigation, canScanBarcode]);

  const handleBarCodeRead = useCallback(
    (barcode: BarCodeReadEvent) => {
      if (!barcode) {
        return;
      }

      if (!isFocused) {
        logInfo("Camera screen is not focused but is running, aborting");
        return;
      }

      if (!canScanBarcode()) {
        return;
      }

      lastScannedAt.current = new Date();

      if (!barcode.data || !barcode.data.startsWith("NZCOVIDTRACER")) {
        showError(
          t("screens:scan:errors:couldntScanCode"),
          t("screens:scan:errors:notOfficialMessage"),
        );
        return;
      }

      if (currentUserId == null) {
        showError(t("errors:generic"));
        return;
      }

      try {
        const base64String = barcode.data.substr(14);
        const decodedString = Base64.decode(base64String);
        const qrScanData: QRScanData = JSON.parse(decodedString);

        if (!isQRScanDataValid(qrScanData)) {
          showError(
            t("screens:scan:errors:couldntScanCode"),
            t("screens:scan:errors:notOfficialMessage"),
          );
          return;
        }

        const newId = nanoid();
        const entry = createDiaryEntry(
          qrScanData,
          "scan",
          newId,
          currentUserId!,
        );

        saveEntryAsync(entry);
      } catch (error) {
        showError(
          t("screens:scan:errors:couldntScanCode"),
          t("screens:scan:errors:troubleReading"),
        );
      }
    },
    [canScanBarcode, currentUserId, isFocused, saveEntryAsync, showError, t],
  );

  const appState = useAppState();

  useEffect(() => {
    if (!isFocused || appState !== "active") {
      setFlashLightMode(RNCamera.Constants.FlashMode.off);
    }
  }, [appState, isFocused]);

  const showCamera = useMemo(
    () =>
      appState !== "background" &&
      isCameraMounted &&
      cameraPermission === "granted",
    [isCameraMounted, cameraPermission, appState],
  );

  useEffect(() => {
    if (showCamera) {
      logInfo("show camera");
    } else {
      logInfo("hide camera");
    }
  }, [showCamera]);

  const hasRequestedCameraPermission = useSelector(
    selectHasRequestedCameraPermission,
  );

  const accessibilityLabel =
    flashLightMode === RNCamera.Constants.FlashMode.off
      ? t("screens:scan:accessibility:torchOffLabel")
      : t("screens:scan:accessibility:torchOnLabel");

  const accessibilityHint =
    flashLightMode === RNCamera.Constants.FlashMode.off
      ? t("screens:scan:accessibility:hint")
      : "";

  const camera = useMemo(() => {
    switch (cameraPermission) {
      case "denied":
        // Show not authorized status if user denied permission from a prompt
        return hasRequestedCameraPermission ? (
          <CameraNotAuthorized />
        ) : (
          <Pending />
        );
      case "blocked":
      case "unavailable":
        return <CameraNotAuthorized />;
      case "granted":
        return showCamera ? (
          <RNCamera
            ref={generateTestHook("camera", cameraRef)}
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={handleBarCodeRead}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            captureAudio={false}
            flashMode={flashLightMode}
          >
            <BarcodeMask
              width={250}
              height={250}
              edgeRadius={5}
              maskOpacity={0}
              edgeColor={colors.black}
              showAnimatedLine={false}
            />
            <FlashLightIconContainer
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="button"
              accessibilityHint={accessibilityHint}
              onPress={handleFlashLightMode}
            >
              <FlashLightIcon
                source={
                  flashLightMode === RNCamera.Constants.FlashMode.off
                    ? assets.flashLightOff
                    : assets.flashLightOn
                }
              />
            </FlashLightIconContainer>
          </RNCamera>
        ) : (
          <Pending />
        );
    }
  }, [
    cameraPermission,
    generateTestHook,
    handleBarCodeRead,
    showCamera,
    hasRequestedCameraPermission,
    flashLightMode,
    handleFlashLightMode,
    accessibilityLabel,
    accessibilityHint,
  ]);

  return (
    <Container>
      {camera}
      <FooterContainer>
        <Instruction fontFamily="baloo-semi-bold" maxFontSizeMultiplier={1.5}>
          {t("screens:scan:instructions")}
        </Instruction>
        <VerticalSpacing />
        <Button
          testID="scan:addManualEntry"
          text={t("screens:scan:addManualEntry")}
          onPress={onManualPress}
        />
      </FooterContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
