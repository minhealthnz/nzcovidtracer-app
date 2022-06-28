import { Card } from "@components/molecules/Card";
import { colors } from "@constants";
import { selectUserId } from "@domain/user/selectors";
import { requestCameraPermission } from "@features/device/reducer";
import {
  selectCameraPermission,
  selectHasRequestedCameraPermission,
} from "@features/device/selectors";
import {
  AddDiaryEntry,
  addEntry,
  setHasSeenScanTutorial,
} from "@features/diary/reducer";
import { selectHasSeenScanTutorial } from "@features/diary/selectors";
import { useEasterEggOverlay } from "@features/easterEgg/hooks/useEasterEggOverlay";
import { LocationScreen } from "@features/locations/screens";
import { isAndroid, isSmallScreen } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { useAppState } from "@react-native-community/hooks";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import { useCavy } from "cavy";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  InteractionManager,
  StyleSheet,
  Vibration,
} from "react-native";
import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import CameraNotAuthorized from "../components/CameraNotAuthorized";
import { ScannerBanner } from "../components/ScanBanner";
import { parseBarcode } from "../helpers";
import { createDiaryEntry } from "../helpers";
import { ScanScreen } from "../screens";
import { ScanData, ScanDataSurprise } from "../types";

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

const assets = {
  flashLightOn: require("@assets/icons/flashlight-on.png"),
  flashLightOff: require("@assets/icons/flashlight-off.png"),
  manualEntry: require("@assets/icons/manual-entry.png"),
  mask: require("@features/scan/assets/images/mask.png"),
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
  width: 100%;
  align-items: flex-start;
`;

const FlashLightIconContainer = styled.TouchableOpacity`
  padding-top: 15px;
  align-items: flex-end;
`;

const FlashLightIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

const MaskImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.View`
  width: 82%;
  height: 60%;
`;

const MaskView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

  const { showEasterEgg, renderEasterEgg } = useEasterEggOverlay();

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

  const saveEntryAsync = useCallback(
    async (entry: AddDiaryEntry) => {
      try {
        // TODO Create a separate interface for inserts
        if (entry.id == null) {
          throw new Error("Entry has no id!");
        }

        try {
          await dispatch(addEntry(entry)).then(unwrapResult);

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

    props.navigation.navigate(LocationScreen.PlaceOrActivity, {
      startDate: new Date().getTime(),
    });
  }, [props.navigation, canScanBarcode]);

  const handleBarCodeRead = useCallback(
    async (barcode: BarCodeReadEvent) => {
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
      if (currentUserId == null) {
        showError(t("errors:generic"));
        return;
      }
      const qrScanData = await parseBarcode(barcode.data);
      if (qrScanData == null) {
        showError(
          t("screens:scan:errors:couldntScanCode"),
          t("screens:scan:errors:notOfficialMessage"),
        );
        return;
      }

      if ("data" in qrScanData) {
        if (isAndroid) {
          Vibration.vibrate([0, 600]);
        } else {
          ReactNativeHapticFeedback.trigger(
            "notificationSuccess",
            hapticFeedBackOptions,
          );
        }
        showEasterEgg((qrScanData as ScanDataSurprise).data);
        return;
      }

      const newId = nanoid();
      const entry = createDiaryEntry(
        qrScanData as ScanData,
        "scan",
        newId,
        currentUserId,
      );

      saveEntryAsync(entry);
    },
    [
      canScanBarcode,
      currentUserId,
      isFocused,
      saveEntryAsync,
      showError,
      t,
      showEasterEgg,
    ],
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

  const { manualEntryButtonTitle, manualEntryButtonDescription } =
    useMemo(() => {
      if (isSmallScreen(Dimensions.get("window").width)) {
        return {
          manualEntryButtonTitle: t(
            "screens:scan:smallScreenManualEntryButtonTitle",
          ),
          manualEntryButtonDescription: t(
            "screens:scan:manualEntryButtonDescription",
          ),
        };
      } else {
        return {
          manualEntryButtonTitle: t("screens:scan:manualEntryButtonTitle"),
          manualEntryButtonDescription: t(
            "screens:scan:manualEntryButtonDescription",
          ),
        };
      }
    }, [t]);

  const displayFooter = useMemo(() => {
    return (
      <>
        <FooterContainer>
          <Card
            headerImage={assets.manualEntry}
            title={manualEntryButtonTitle}
            description={manualEntryButtonDescription}
            onPress={onManualPress}
            maxFontSizeMultiplier={1.5}
          />
        </FooterContainer>
      </>
    );
  }, [manualEntryButtonTitle, manualEntryButtonDescription, onManualPress]);

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
            <MaskView>
              <ImageContainer>
                <MaskImage source={assets.mask} resizeMode="stretch" />
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
              </ImageContainer>
            </MaskView>
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
    accessibilityLabel,
    accessibilityHint,
    handleFlashLightMode,
    flashLightMode,
  ]);
  return (
    <>
      <Container>
        <ScannerBanner />
        {camera}
        {displayFooter}
      </Container>
      {renderEasterEgg}
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
