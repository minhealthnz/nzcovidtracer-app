import { Text } from "@components/atoms";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes, grid } from "@constants";
import { requestCallbackEnf } from "@features/enfExposure/reducer";
import { errors as enfExposureErrors } from "@features/enfExposure/reducer";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { navigationMaxDuration } from "@navigation/constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { AsyncThunkAction, unwrapResult } from "@reduxjs/toolkit";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import styled from "styled-components/native";

import { recordCallbackRequested } from "../analytics";
import { requestCallback } from "../reducer";
import { RequestCallbackScreen } from "../screens";
import { errors } from "../service/types";

const Container = styled.View`
  background-color: ${colors.yellowConfirm};
  padding: 16px 20px 0 20px;
  margin-bottom: ${grid}px;
`;

const Title = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.small}px;
  margin-bottom: 4px;
`;

const Detail = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  margin-bottom: 18px;
`;

interface Props
  extends StackScreenProps<MainStackParamList, RequestCallbackScreen.Confirm> {}

const { logError } = createLogger("RequestCallbackConfirm.tsx");

export default function RequestCallbackConfirm(props: Props) {
  const { t } = useTranslation();
  const { firstName, lastName, phone, notes, alertType } = props.route.params;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [navLock, setNavLock] = useState(false);
  const formRef = useRef<FormV2Handle>(null);

  // Prevent taps while navigating away
  useEffect(() => {
    const handle = setTimeout(() => {
      setNavLock(false);
    }, navigationMaxDuration);
    return () => clearTimeout(handle);
  }, [navLock]);

  const upload: AsyncThunkAction<any, any, any> = useMemo(() => {
    switch (alertType) {
      case "location":
        return requestCallback({
          firstName,
          lastName,
          phone,
          notes,
        });
      case "enf":
        return requestCallbackEnf({
          firstName,
          lastName,
          phone,
          notes,
        });
    }
  }, [alertType, firstName, lastName, phone, notes]);

  const onConfirm = useCallback(() => {
    setIsLoading(true);

    dispatch(upload)
      .then(unwrapResult)
      .then(() => {
        recordCallbackRequested(alertType);
        props.navigation.navigate(TabScreen.Home);
        setIsLoading(false);
        setNavLock(true);
      })
      .catch((err) => {
        setIsLoading(false);
        switch (err.code) {
          case errors.requestCallback.network:
          case enfExposureErrors.requestCallbackEnf.network:
            formRef.current?.showToast(t("errors:network"));
            break;
          case enfExposureErrors.requestCallbackEnf.disabled:
            formRef.current?.showToast(t("errors:enfCallback:disabled"));
            break;
          default:
            Alert.alert(t("errors:generic"));
            break;
        }
        logError(err);
      });
  }, [dispatch, props.navigation, upload, t, alertType]);

  const onGoBack = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  const buttonLoading = isLoading || navLock;

  useAccessibleTitle();

  return (
    <FormV2
      ref={formRef}
      heading={t("screens:requestCallbackConfirm:heading")}
      buttonText={t("screens:requestCallbackConfirm:confirm")}
      onButtonPress={onConfirm}
      buttonLoading={buttonLoading}
      secondaryButtonText={t("screens:requestCallbackConfirm:goBack")}
      onSecondaryButtonPress={buttonLoading ? undefined : onGoBack}
    >
      <Container>
        <Title>{t("screens:requestCallbackConfirm:firstName")}</Title>
        <Detail>{firstName ?? ""}</Detail>
        <Title>{t("screens:requestCallbackConfirm:lastName")}</Title>
        <Detail>{lastName ?? ""}</Detail>
        <Title>{t("screens:requestCallbackConfirm:phone")}</Title>
        <Detail>{phone ?? ""}</Detail>
        <Title>{t("screens:requestCallbackConfirm:notes")}</Title>
        <Detail>{notes ?? ""}</Detail>
      </Container>
    </FormV2>
  );
}
