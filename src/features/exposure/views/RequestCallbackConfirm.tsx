import { Text } from "@components/atoms";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { colors, fontFamilies, fontSizes, grid } from "@constants";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { navigationMaxDuration } from "@navigation/constants";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { unwrapResult } from "@reduxjs/toolkit";
import { TabScreen } from "@views/screens";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { requestCallback } from "../reducer";
import { RequestCallbackScreen } from "../screens";
import { errors } from "../service/types";
import { RequestCallbackParamList } from "./RequestCallbackStack";

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
  extends StackScreenProps<
    RequestCallbackParamList,
    RequestCallbackScreen.Confirm
  > {}

const { logError } = createLogger("RequestCallbackConfirm.tsx");

export default function RequestCallbackConfirm(props: Props) {
  const { t } = useTranslation();
  const { firstName, lastName, phone, notes } = props.route.params;
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

  const onConfirm = useCallback(() => {
    setIsLoading(true);
    dispatch(
      requestCallback({
        firstName,
        lastName,
        phone,
        notes,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        recordAnalyticEvent(AnalyticsEvent.CallbackRequested);
        props.navigation.navigate(TabScreen.Home);
        setIsLoading(false);
        setNavLock(true);
      })
      .catch((err) => {
        setIsLoading(false);
        switch (err.code) {
          case errors.requestCallback.network:
            formRef.current?.showToast(t("errors:network"));
            break;
          default:
            Alert.alert(t("errors:generic"));
            break;
        }
        logError(err);
      });
  }, [dispatch, props.navigation, firstName, lastName, phone, notes, t]);

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
