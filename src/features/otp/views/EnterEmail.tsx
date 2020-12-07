import { InputGroup, TextInput } from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { DiaryStackParamList } from "@features/diary/views/DiaryStack";
import { isNetworkError } from "@lib/helpers";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { emailValidation } from "@validations/validations";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { initiateOTP } from "../api";
import { ERROR_EMAIL_VALIDATION, ERROR_TOO_MANY_ATTEMPTS } from "../errors";
import { useOtpSession } from "../hooks/useOtpSession";
import { updateSession } from "../reducer";
import { OTPScreen } from "../screens";
import { styles } from "../styles";

const schema = yup.object().shape({
  email: emailValidation,
});

interface Props
  extends StackScreenProps<DiaryStackParamList, OTPScreen.EnterEmail> {}

const { logError } = createLogger("EnterEmail.tsx");

export function EnterEmail(props: Props) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanErrors = useCallback(() => {
    setEmailError("");
  }, [setEmailError]);

  const dispatch = useDispatch();

  const sessionId = props.route.params.sessionId;
  const session = useOtpSession(sessionId);

  useLayoutEffect(() => {
    if (session?.enterEmailScreenTitle != null) {
      props.navigation.setOptions({
        title: session?.enterEmailScreenTitle,
      });
    }
  }, [session, props.navigation]);

  const clearForm = useCallback(() => {
    setEmail("");
    setIsLoading(false);
  }, [setEmail, setIsLoading]);

  useEffect(() => {
    clearForm();
  }, [sessionId, clearForm]);

  const formRef = useRef<FormV2Handle | null>(null);

  const onSubmitPress = useCallback(() => {
    Keyboard.dismiss();

    cleanErrors();
    schema
      .validate({ email })
      .then(() => {
        setIsLoading(true);
        initiateOTP(email) // TODO move to saga / async thunk
          .then((response) => {
            dispatch(
              updateSession({
                id: sessionId,
                email,
                verificationId: response.data.verificationId,
              }),
            );
            setIsLoading(false);
            props.navigation.navigate(OTPScreen.VerifyEmail, { sessionId });
          })
          .catch((error) => {
            setIsLoading(false);
            if (isNetworkError(error)) {
              formRef.current?.showToast(t("errors:network"));
              return;
            }
            // TODO these are not validation errors, rename the string keys
            if (!error?.response?.data) {
              setEmailError(t("validations:email:generic"));
              return;
            }
            switch (error.response.data.type) {
              case ERROR_TOO_MANY_ATTEMPTS:
                setEmailError(t("validations:code:tooManyAttempts"));
                return;
              case ERROR_EMAIL_VALIDATION:
                setEmailError(t("validations:email:notValid"));
                return;
              default:
                logError("Unexpected error.", error);
                setEmailError(t("validations:email:generic"));
                return;
            }
          });
      })
      .catch((error: yup.ValidationError) => {
        setEmailError(t(error.message));

        inputGroupRef.current?.focusError("email");
      });
  }, [cleanErrors, email, t, props.navigation, dispatch, sessionId]);

  useAccessibleTitle();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  const handleChangeEmail = useCallback(
    (value: string) => setEmail(value.trim()),
    [],
  );

  return (
    <FormV2
      ref={formRef}
      heading={t("screens:enterEmail:title")}
      headingStyle={styles.headingBig}
      description={t("screens:enterEmail:description")}
      buttonText={t("screens:enterEmail:submit")}
      onButtonPress={onSubmitPress}
      buttonLoading={isLoading}
      keyboardAvoiding={true}
    >
      <InputGroup ref={inputGroupRef}>
        <TextInput
          {...presets.email}
          identifier="email"
          testID="enterEmail:email"
          label={t("screens:enterEmail:email")}
          value={email}
          onChangeText={handleChangeEmail}
          required="required"
          errorMessage={emailError}
          clearErrorMessage={() => setEmailError("")}
          onSubmitEditing={onSubmitPress}
        />
      </InputGroup>
    </FormV2>
  );
}
