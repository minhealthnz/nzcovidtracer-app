import { InputGroup, TextInput } from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { ProfileScreen } from "@features/profile/screens";
import { ProfileStackParamList } from "@features/profile/views/ProfileNavigator";
import { navigationMaxDuration } from "@navigation/constants";
import { debounce } from "@navigation/debounce";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useBackButton } from "@navigation/hooks/useBackButton";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid } from "@reduxjs/toolkit";
import { dataRequestCodeValidation } from "@validations/validations";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { useShareDiaryRequest } from "../hooks/useShareDiaryRequest";
import { shareDiary } from "../reducer";

const assets = {
  headerImage: require("@assets/images/Send.png"),
};

export interface ShareDiaryProps
  extends StackScreenProps<ProfileStackParamList, ProfileScreen.ShareDiary> {}

const schema = yup.object().shape({
  dataRequestCode: dataRequestCodeValidation,
});

export function ShareDiary(props: ShareDiaryProps) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [requestId] = useState<string>(nanoid());
  const shareDiaryRequest = useShareDiaryRequest(requestId);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!shareDiaryRequest?.fulfilled) {
      return;
    }

    props.navigation.replace(ProfileScreen.DiaryShared);

    const handle = setTimeout(() => {
      setIsLoading(false);
    }, navigationMaxDuration);

    return () => clearTimeout(handle);
  }, [shareDiaryRequest, props.navigation]);

  const formRef = useRef<FormV2Handle | null>(null);

  useEffect(() => {
    if (shareDiaryRequest?.error) {
      if (shareDiaryRequest.error.isToast) {
        formRef.current?.showToast(t(shareDiaryRequest.error.message));
      } else {
        setCodeError(t(shareDiaryRequest.error.message));
      }
      setIsLoading(false);
    }
  }, [shareDiaryRequest, t]);

  const handleBackPressed = () => {
    return isLoading;
  };

  useBackButton(props.navigation, { handleBackPressed });

  const onSharePress = debounce(() => {
    Keyboard.dismiss();

    cleanErrors();
    schema
      .validate({ dataRequestCode })
      .then(() => {
        setIsLoading(true);
        dispatch(
          shareDiary({
            requestId,
            code: dataRequestCode,
          }),
        );
      })
      .catch((error: yup.ValidationError) => {
        if (error.message) {
          setCodeError(t(error.message));
          inputGroupRef.current?.focusError("dataRequestCode");
        }
      });
  });

  const [dataRequestCode, setDataRequestCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const cleanErrors = () => {
    setCodeError("");
    formRef.current?.hideToast();
  };

  useAccessibleTitle();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  return (
    <FormV2
      ref={formRef}
      headerImage={assets.headerImage}
      heading={t("screens:shareDiary:title")}
      description={t("screens:shareDiary:description")}
      onButtonPress={onSharePress}
      buttonText={t("screens:shareDiary:share")}
      buttonLoading={isLoading}
      keyboardAvoiding={true}
    >
      <InputGroup ref={inputGroupRef}>
        <TextInput
          {...presets.alphaNumericCode}
          identifier="dataRequestCode"
          testID="shareDiary:dataRequestCode"
          label={t("screens:shareDiary:dataRequestCode")}
          value={dataRequestCode}
          onChangeText={(value: string) => setDataRequestCode(value.trim())}
          required="required"
          errorMessage={codeError}
          clearErrorMessage={() => setCodeError("")}
          info={t("screens:shareDiary:dataRequestCodeInfo")}
          onSubmitEditing={onSharePress}
        />
      </InputGroup>
    </FormV2>
  );
}
