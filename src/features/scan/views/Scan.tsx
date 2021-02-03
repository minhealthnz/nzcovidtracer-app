import { Button, ImageButton, Text, VerticalSpacing } from "@components/atoms";
import { colors } from "@constants";
import { requestCameraPermission } from "@domain/device/reducer";
import {
  selectCameraPermission,
  selectHasRequestedCameraPermission,
} from "@domain/device/selectors";
import { selectUserId } from "@domain/user/selectors";
import { addEntry, setHasSeenScanTutorial } from "@features/diary/reducer";
import { DiaryScreen } from "@features/diary/screens";
import { selectHasSeenScanTutorial } from "@features/diary/selectors";
import { DiaryEntry } from "@features/diary/types";
import { isAndroid } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { BarcodeMask } from "@nartc/react-native-barcode-mask";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useAppState } from "@react-native-community/hooks";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { TabScreen } from "@views/screens";
import { useCavy } from "cavy";
import { Base64 } from "js-base64";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { ScanStackParamList } from "./ScanNavigator";

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
  history: require("@assets/icons/diary.png"),
  info: require("@assets/icons/info.png"),
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

const HistoryButton = styled(ImageButton)`
  width: 60px;
  height: 60px;
`;

const InfoButton = styled(ImageButton)`
  width: 60px;
  height: 60px;
`;

const Instruction = styled(Text)`
  padding-left: 1px;
`;

interface Props
  extends StackScreenProps<ScanStackParamList, TabScreen.RecordVisit> {}

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

  useLayoutEffect(() => {
    const handleGoToHistory = () => {
      props.navigation.navigate(DiaryScreen.Navigator, {
        screen: DiaryScreen.Diary,
      });
    };
    const handleInfoPress = () => {
      props.navigation.navigate(ScanScreen.TutorialNavigator);
    };

    props.navigation.setOptions({
      headerLeft: () => (
        <HistoryButton
          image={assets.history}
          onPress={handleGoToHistory}
          testID="goToHistory"
          accessibilityLabel={t("accessibility:button:diaryHistory")}
        />
      ),
      headerRight: () => (
        <InfoButton
          image={assets.info}
          onPress={handleInfoPress}
          testID="goToTutorial"
          accessibilityLabel={t("accessibility:button:startTutorial")}
        />
      ),
    });
  }, [props.navigation, t]);

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

          props.navigation.navigate(ScanScreen.Navigator, {
            screen: ScanScreen.Recorded,
            params: {
              id: entry.id,
            },
          });
        } catch (err) {
          logError(err);
          props.navigation.navigate(ScanScreen.Navigator, {
            screen: ScanScreen.ScanNotRecorded,
          });
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

    props.navigation.navigate(DiaryScreen.Navigator, {
      screen: DiaryScreen.AddEntryManually,
    });
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

  useAccessibleTitle();

  const hasRequestedCameraPermission = useSelector(
    selectHasRequestedCameraPermission,
  );

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
          >
            <BarcodeMask
              width={250}
              height={250}
              edgeRadius={5}
              maskOpacity={0}
              edgeColor={colors.black}
              showAnimatedLine={false}
            />
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
