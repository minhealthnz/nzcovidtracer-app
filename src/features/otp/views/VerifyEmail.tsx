import { Text, TextInput } from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { InputGroup, InputGroupRef } from "@components/molecules/InputGroup";
import { colors, fontFamilies, fontSizes, grid2x, loginLink } from "@constants";
import { commonStyles } from "@lib/commonStyles";
import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { codeValidation } from "@validations/validations";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, Linking } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { initiateOTP } from "../api";
import { confirmOTP } from "../api";
import { statusPending, statusSuccess } from "../colors";
import {
  ERROR_INVALID_AUTH_SESSION,
  ERROR_INVALID_CODE,
  ERROR_MFA_ENABLED,
  ERROR_TOO_MANY_ATTEMPTS,
} from "../errors";
import { useOtpSession } from "../hooks/useOtpSession";
import { otpFulfilled, updateSession } from "../reducer";
import { OTPScreen, OTPScreenParams } from "../screens";

const Description = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans"]};
`;

const EmailAddress = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  margin-bottom: ${grid2x}px;
`;

const CodeResendDescription = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryBlack};
`;

const CodeResend = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.large}px;
  padding: ${grid2x}px 0;
  color: ${colors.primaryBlack};
  text-decoration: underline;
`;

const StatusBox = styled.View<{ color: string }>`
  border: 4px solid ${(props) => props.color};
  padding: 16px;
`;

const Status = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
`;

const { logInfo, logError } = createLogger("views/VerifyEmail");

const schema = yup.object().shape({
  code: codeValidation,
});

interface Props
  extends StackScreenProps<OTPScreenParams, OTPScreen.VerifyEmail> {}

export function VerifyEmail(props: Props) {
  const { t } = useTranslation();

  const sessionId = props.route.params.sessionId;
  const session = useOtpSession(sessionId);

  useLayoutEffect(() => {
    if (session?.verifyEmailScreenTitle != null) {
      props.navigation.setOptions({
        title: session?.verifyEmailScreenTitle,
      });
    }
  }, [session, props.navigation]);

  const dispatch = useDispatch();
  const formRef = useRef<FormV2Handle>(null);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [hasResentCode, setHasResentCode] = useState(false);
  const statusText = useMemo(() => {
    if (isResending) {
      return t("screens:verifyEmail:resendingCode");
    }
    if (hasResentCode) {
      return t("screens:verifyEmail:codeSent");
    }
    return "";
  }, [t, isResending, hasResentCode]);
  const statusColor = useMemo(() => {
    if (isResending) {
      return statusPending;
    }
    if (hasResentCode) {
      return statusSuccess;
    }
    return colors.white;
  }, [isResending, hasResentCode]);

  useEffect(() => {
    if (isResending) {
      formRef.current?.scrollToEnd();
    }
  }, [isResending]);

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.RegistrationVerify);
    }, []),
  );

  const cleanErrors = useCallback(() => {
    setCodeError("");
  }, [setCodeError]);

  const onResendPress = useCallback(() => {
    if (session.email == null) {
      // TODO show error
      return;
    }
    setIsResending(true);
    initiateOTP(session.email)
      .then((response) => {
        setIsResending(false);
        dispatch(
          updateSession({
            id: sessionId,
            verificationId: response.data.verificationId,
            userId: response.data.userId,
          }),
        );
        setHasResentCode(true);
      })
      .catch((error) => {
        setIsResending(false);
        if (isNetworkError(error)) {
          formRef.current?.showToast(t("errors:network"));
        } else {
          setCodeError(t("validations:code:generic"));
        }
        logError("Unexpected error.", error);
      });
  }, [session, dispatch, sessionId, t]);

  const onSubmitPress = useCallback(() => {
    Keyboard.dismiss();

    cleanErrors();
    schema
      .validate({ code })
      .then(() => {
        if (session.email == null || session.verificationId == null) {
          // TODO show error
          return;
        }
        setIsLoading(true);

        confirmOTP(session.email, session.verificationId, code)
          .then((response) => {
            setIsLoading(false);
            dispatch(
              updateSession({
                id: sessionId,
                userId: response.data.userId,
              }),
            );
            dispatch(
              otpFulfilled({
                sessionId,
                accessToken: response.data.accessToken,
              }),
            );
          })
          .catch((error) => {
            setIsLoading(false);
            if (isNetworkError(error)) {
              formRef.current?.showToast(t("errors:network"));
              return;
            }
            if (!error?.response?.data) {
              logError("Unexpected error. Response data is empty");
              setCodeError(t("validations:code:generic"));
              return;
            }
            switch (error.response.data.type) {
              case ERROR_INVALID_CODE:
                setCodeError(t("validations:code:invalidAuthCode"));
                return;
              case ERROR_INVALID_AUTH_SESSION:
                Alert.alert(
                  t("validations:errorTitle"),
                  t("validations:code:invalidAuthSession"),
                  [{ text: "OK", onPress: () => props.navigation.goBack() }],
                  { cancelable: false },
                );
                return;
              case ERROR_TOO_MANY_ATTEMPTS:
                setCodeError(t("validations:code:tooManyAttempts"));
                return;
              case ERROR_MFA_ENABLED:
                switch (session.mfaErrorHandling) {
                  case "ignore":
                    logInfo("mfa error, ignore");
                    dispatch(
                      updateSession({
                        id: sessionId,
                        userId: error.response.data.userId,
                      }),
                    );
                    dispatch(
                      otpFulfilled({
                        sessionId,
                      }),
                    );
                    break;
                  case "prompt":
                    logInfo("mfa error, prompt");
                    setCode("");
                    Alert.alert(
                      t("errors:mfaEnabled:title"),
                      t("errors:mfaEnabled:detail"),
                      [
                        {
                          text: t("errors:mfaEnabled:cancel"),
                          style: "cancel",
                        },
                        {
                          text: t("errors:mfaEnabled:loginOnline"),
                          onPress() {
                            Linking.openURL(loginLink);
                          },
                        },
                      ],
                    );
                    break;
                }
                return;
              default:
                logError("Unexpected error.", error);
                setCodeError(t("validations:code:generic"));
                return;
            }
          });
      })
      .catch((error: yup.ValidationError) => {
        setCodeError(t(error.message));

        inputGroupRef.current?.focusError("email");
      });
  }, [cleanErrors, code, t, props.navigation, session, dispatch, sessionId]);

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  useAccessibleTitle();

  if (session == null) {
    return null;
  }

  return (
    <FormV2
      ref={formRef}
      heading={t("screens:verifyEmail:title")}
      headingStyle={commonStyles.headingBig}
      buttonText={t("screens:verifyEmail:submit")}
      onButtonPress={onSubmitPress}
      buttonLoading={isLoading}
      keyboardAvoiding={true}
    >
      <Description>{t("screens:verifyEmail:descriptionP1")}</Description>
      <EmailAddress>{session.email}</EmailAddress>
      <InputGroup ref={inputGroupRef}>
        <TextInput
          {...presets.numericCode}
          testID="verifyEmail:code"
          value={code}
          onChangeText={setCode}
          required="required"
          errorMessage={codeError}
          clearErrorMessage={() => setCodeError("")}
          onSubmitEditing={onSubmitPress}
        />
      </InputGroup>
      <CodeResendDescription>
        {t("screens:verifyEmail:codeResendDescription")}
      </CodeResendDescription>
      <CodeResend
        accessible
        accessibilityLabel={
          isResending
            ? t("screens:verifyEmail:resendingCode")
            : t("screens:verifyEmail:codeResend")
        }
        accessibilityRole={isResending ? "text" : "button"}
        onPress={isResending ? undefined : onResendPress}
      >
        {isResending
          ? t("screens:verifyEmail:resendingCode")
          : t("screens:verifyEmail:codeResend")}
      </CodeResend>
      {(isResending || hasResentCode) && (
        <StatusBox color={statusColor}>
          <Status>{statusText}</Status>
        </StatusBox>
      )}
    </FormV2>
  );
}
