import { InputGroup } from "@components/atoms";
import { PhoneInput } from "@components/atoms/PhoneInput";
import { presets, TextInput } from "@components/atoms/TextInput";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { updateDetails } from "@domain/user/reducer";
import { selectUserId } from "@domain/user/selectors";
import { initiateOTP } from "@features/otp/api";
import {
  ERROR_EMAIL_VALIDATION,
  ERROR_TOO_MANY_ATTEMPTS,
} from "@features/otp/errors";
import { createOTPSession } from "@features/otp/reducer";
import { OTPScreen } from "@features/otp/screens";
import { isNetworkError } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { formatPhone } from "@utils/formatPhone";
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
} from "@validations/validations";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard } from "react-native";
import { CountryCode } from "react-native-country-picker-modal";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { OnboardingScreen } from "../screens";
import { styles } from "../styles";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { OnboardingStackParamList } from "./OnboardingStack";

const { logError } = createLogger("ContactDetails.tsx");

export function ContactDetails(
  props: StackScreenProps<
    OnboardingStackParamList,
    OnboardingScreen.ContactDetails
  >,
) {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("NZ");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const formattedPhone = useMemo(() => formatPhone(phone, countryCode), [
    phone,
    countryCode,
  ]);

  const userId = useSelector(selectUserId);

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      recordAnalyticEvent(AnalyticsEvent.RegistrationDetails);
    }, []),
  );

  const schema = yup.object().shape({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    phone: phoneValidation,
    email: emailValidation,
  });

  const dispatch = useAppDispatch();

  const { stepText, skip } = useOnboardingFlow(
    props,
    OnboardingScreen.ContactDetails,
  );

  const formRef = useRef<FormV2Handle | null>(null);

  const handleSubmit = () => {
    Keyboard.dismiss();
    schema
      .validate(
        {
          firstName,
          lastName,
          phone: [phone, countryCode],
          email,
        },
        {
          abortEarly: false,
        },
      )
      .then(() => {
        setLoading(true);
        if (userId == null) {
          throw new Error("user id is null");
        }

        return dispatch(
          updateDetails({
            userId,
            firstName,
            lastName,
            email,
            phone: formattedPhone,
          }),
        );
      })
      .then(unwrapResult)
      .then(() => {
        // TODO Extract this logic to a saga / async thunk
        // TODO Flatten promise
        initiateOTP(email)
          .then((response) => {
            setLoading(false);
            const sessionId = nanoid();
            dispatch(
              createOTPSession({
                id: sessionId,
                type: "onboardingNew",
                email,
                verificationId: response.data.verificationId,
                verifyEmailScreenTitle: stepText,
                mfaErrorHandling: "prompt",
              }),
            );
            props.navigation.navigate(OTPScreen.VerifyEmail, {
              sessionId,
            });
          })
          .catch((error) => {
            setLoading(false);
            if (isNetworkError(error)) {
              formRef.current?.showToast(t("errors:network"));
              return;
            }
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
                setEmailError(t("validations:email:generic"));
                return;
            }
          });
      })
      .catch((error: yup.ValidationError | Error) => {
        if (error instanceof yup.ValidationError && error.inner) {
          error.inner.forEach((item) => {
            switch (item.path) {
              case "email":
                setEmailError(t(item.message));
                break;
              case "firstName":
                setFirstNameError(t(item.message));
                break;
              case "lastName":
                setLastNameError(t(item.message));
                break;
              case "phone":
                setPhoneError(t(item.message));
                break;
            }
          });

          inputGroupRef.current?.focusError(...error.inner.map((x) => x.path));
        } else {
          Alert.alert(t("errors:generic"));
          logError(error);
        }
      });
  };

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  useAccessibleTitle();

  const handleChangeEmail = useCallback(
    (value: string) => setEmail(value.trim()),
    [],
  );

  return (
    <FormV2
      ref={formRef}
      heading={t("screens:contactDetails:heading")}
      headingStyle={styles.headingBig}
      description={t("screens:contactDetails:description")}
      headerImage={require("../assets/images/phone-call.png")}
      buttonText={t("screens:contactDetails:submit")}
      onButtonPress={handleSubmit}
      secondaryButtonText={t("screens:contactDetails:doThisLater")}
      onSecondaryButtonPress={skip}
      buttonLoading={loading}
      keyboardAvoiding={true}
    >
      <InputGroup onSubmit={handleSubmit} ref={inputGroupRef}>
        <TextInput
          {...presets.email}
          identifier="email"
          label={t("screens:contactDetails:email")}
          value={email}
          onChangeText={handleChangeEmail}
          errorMessage={t(emailError)}
          clearErrorMessage={() => setEmailError("")}
        />
        <TextInput
          {...presets.firstName}
          identifier="firstName"
          label={t("screens:contactDetails:firstName")}
          value={firstName}
          onChangeText={setFirstName}
          errorMessage={t(firstNameError)}
          clearErrorMessage={() => setFirstNameError("")}
        />
        <TextInput
          {...presets.lastName}
          identifier="lastName"
          label={t("screens:contactDetails:lastName")}
          value={lastName}
          onChangeText={setLastName}
          errorMessage={t(lastNameError)}
          clearErrorMessage={() => setLastNameError("")}
        />
        <PhoneInput
          identifier="phone"
          label={t("screens:contactDetails:phoneNumber")}
          info={t("screens:contactDetails:phoneNumberInfo")}
          countryCode={countryCode}
          onChangeCountry={(country) => {
            setCountryCode(country.cca2);
          }}
          phone={phone}
          onChangePhone={setPhone}
          errorMessage={t(phoneError)}
          clearErrorMessage={() => setPhoneError("")}
        />
      </InputGroup>
    </FormV2>
  );
}
