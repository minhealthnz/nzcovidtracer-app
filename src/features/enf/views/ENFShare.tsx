import { InputGroup, TextInput, VerticalSpacing } from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2, FormV2Handle } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { colors } from "@constants";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { SerializedError, unwrapResult } from "@reduxjs/toolkit";
import { enfRequestCodeValidation } from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { errors } from "../errors";
import { shareDiagnosis } from "../reducer";
import { ENFScreen } from "../screens";

const assets = {
  headerImage: require("@assets/images/Send.png"),
};

const schema = yup.object().shape({
  code: enfRequestCodeValidation,
});

interface Props extends StackScreenProps<MainStackParamList, ENFScreen.Share> {}

export function ENFShare(props: Props) {
  const { t } = useTranslation();
  const formRef = useRef<FormV2Handle>(null);

  useAccessibleTitle();

  const { navigation } = props;

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  const setError = useCallback((errorMessage: string) => {
    setCodeError(errorMessage);
    inputGroupRef.current?.focusError("dataRequestCode");
  }, []);

  const onSubmit = useCallback(() => {
    Keyboard.dismiss();

    schema
      .validate({ code })
      .then(async () => {
        setIsLoading(true);
        return dispatch(
          shareDiagnosis({
            code,
          }),
        );
      })
      .then(unwrapResult)
      .then(() => {
        navigation.replace(ENFScreen.ShareSuccess);
      })
      .catch((error: yup.ValidationError | SerializedError) => {
        recordAnalyticEvent(AnalyticsEvent.ENFShareUploadCodeFailure, {
          error:
            error instanceof yup.ValidationError
              ? "validation"
              : error.code || errors.shareDiagnosis.unknown,
        });
        if (error instanceof yup.ValidationError) {
          setError(t(error.message));
          return;
        }
        switch (error.code) {
          case errors.shareDiagnosis.expired:
          case errors.shareDiagnosis.noExists:
            setError(t("screens:enfShare:errors:code:invalid"));
            break;
          case errors.shareDiagnosis.networkError:
            formRef.current?.showToast(
              t("screens:enfShare:errors:code:network"),
            );
            break;
          case errors.shareDiagnosis.rateLimited:
            formRef.current?.showToast(
              t("screens:enfShare:errors:code:rateLimited"),
            );
            break;
          default:
            setError(t("errors:generic"));
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [code, navigation, t, dispatch, setError]);

  return (
    <FormV2
      ref={formRef}
      headerImage={assets.headerImage}
      heading={t("screens:enfShare:title")}
      description={t("screens:enfShare:description")}
      buttonText={t("screens:enfShare:button")}
      buttonAccessibilityLabel={t("screens:enfShare:buttonAccessibilityLabel")}
      onButtonPress={onSubmit}
      buttonLoading={isLoading}
      keyboardAvoiding={true}
    >
      <Tip backgroundColor={colors.lightYellow}>
        <TipText>{t("screens:enfShare:tip")}</TipText>
      </Tip>
      <VerticalSpacing height={30} />

      <InputGroup ref={inputGroupRef}>
        <TextInput
          label={t("screens:enfShare:inputLabel")}
          value={code}
          onChangeText={setCode}
          errorMessage={codeError}
          clearErrorMessage={() => setCodeError("")}
          identifier="dataRequestCode"
          testID="shareENF:input"
          required="required"
          info={t("screens:enfShare:inputInfo")}
          onSubmitEditing={onSubmit}
          {...presets.numericCode}
        />
      </InputGroup>
    </FormV2>
  );
}
