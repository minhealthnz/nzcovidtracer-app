import { InputGroup, TextInput, VerticalSpacing } from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { formatPhone } from "@utils/formatPhone";
import {
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
} from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { Country, CountryCode } from "react-native-country-picker-modal";
import * as yup from "yup";

import { PhoneInput } from "../../../components/atoms/PhoneInput";
import { recordCallbackSubmitPressed } from "../analytics";
import { RequestCallbackScreen } from "../screens";

interface RequestCallbackProps
  extends StackScreenProps<
    MainStackParamList,
    RequestCallbackScreen.RequestCallback
  > {}

export default function RequestCallback({
  navigation,
  route,
}: RequestCallbackProps) {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("NZ");
  const [notes, setNotes] = useState("");

  const formattedPhone = useMemo(
    () => formatPhone(phone, countryCode),
    [phone, countryCode],
  );

  const [phoneError, setPhoneError] = useState("");

  const handleChangeCountry = (country: Country) => {
    setCountryCode(country.cca2);
  };

  const { t } = useTranslation();

  const schema = yup.object().shape({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    phone: phoneValidation,
  });

  const alertType = route.params.alertType;
  const onSubmit = () => {
    Keyboard.dismiss();

    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    schema
      .validate(
        {
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          phone: [phone, countryCode],
        },
        { abortEarly: false },
      )
      .then(() => {
        recordCallbackSubmitPressed(alertType);
        navigation.navigate(RequestCallbackScreen.Confirm, {
          alertType,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          phone: formattedPhone,
          notes,
        });
      })
      .catch((error: yup.ValidationError) => {
        if (error.inner) {
          error.inner.forEach((item) => {
            switch (item.path) {
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
        }
      });
  };

  useAccessibleTitle();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  return (
    <FormV2
      heading={t("screens:requestCallback:heading")}
      onButtonPress={onSubmit}
      buttonText={t("screens:requestCallback:submit")}
      keyboardAvoiding={true}
    >
      <InputGroup ref={inputGroupRef}>
        <VerticalSpacing height={9} />
        <TextInput
          identifier="firstName"
          {...presets.firstName}
          testID="requestCallback:firstName"
          label={t("screens:requestCallback:firstName")}
          value={firstName}
          onChangeText={setFirstName}
          required="required"
          errorMessage={firstNameError}
          clearErrorMessage={() => setFirstNameError("")}
        />
        <TextInput
          identifier="lastName"
          {...presets.lastName}
          testID="requestCallback:lastName"
          label={t("screens:requestCallback:lastName")}
          value={lastName}
          onChangeText={setLastName}
          required="required"
          errorMessage={lastNameError}
          clearErrorMessage={() => setLastNameError("")}
        />
        <PhoneInput
          identifier="phone"
          label={t("screens:requestCallback:phone")}
          info={t("screens:requestCallback:phoneInfo")}
          required="required"
          phone={phone}
          onChangePhone={setPhone}
          countryCode={countryCode}
          onChangeCountry={handleChangeCountry}
          errorMessage={phoneError}
          preferredCountries={["NZ"]}
          clearErrorMessage={() => setPhoneError("")}
        />
        <TextInput
          identifier="notes"
          testID="requestCallback:notes"
          label={t("screens:requestCallback:notes")}
          value={notes}
          onChangeText={setNotes}
          required="optional"
          info={t("screens:requestCallback:notesInfo")}
          numberOfLines={2}
          multiline={true}
          returnKeyType="default"
        />
      </InputGroup>
    </FormV2>
  );
}
