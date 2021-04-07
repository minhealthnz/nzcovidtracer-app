import {
  InputGroup,
  Text,
  TextInput,
  VerticalSpacing,
} from "@components/atoms";
import { presets } from "@components/atoms/TextInput";
import { Tip, TipText } from "@components/atoms/Tip";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import More from "@components/molecules/More";
import { colors, fontFamilies, fontSizes, grid } from "@constants";
import { setNHI } from "@domain/user/reducer";
import { selectSetNHIFulfilled, selectUser } from "@domain/user/selectors";
import { usePrevious } from "@hooks/usePrevious";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { NHIScreen } from "../screens";

const Title = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
`;
const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
`;

const NHIRegex = /^[a-zA-Z]{3}[0-9]{4}$/;

interface Props extends StackScreenProps<MainStackParamList, NHIScreen.Add> {}
export function NHIAdd(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  // This needs to be cached as nhi can be modified
  const [isEdit] = useState(!!user?.nhi);

  const [showMore, setShowMore] = useState(false);
  const [nhiValue, setNhiValue] = useState(user?.nhi);
  const [validationError, setValidationError] = useState<string>();
  const setNHIFulfilled = useSelector(selectSetNHIFulfilled);
  const prevSetNHIFulfilled = usePrevious(setNHIFulfilled);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();

    const trimmedNhi = nhiValue?.trim();
    if (!trimmedNhi) {
      setValidationError(t("validations:nhi:required"));
      inputGroupRef.current?.focusError("nhiValue");
      return;
    }

    if (!NHIRegex.test(trimmedNhi ?? "")) {
      setValidationError(t("validations:nhi:invalid"));
      inputGroupRef.current?.focusError("nhiValue");
      return;
    }

    const capitalizedNHI = trimmedNhi.toUpperCase();

    dispatch(setNHI(capitalizedNHI));
  }, [dispatch, nhiValue, t]);

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  useEffect(() => {
    if (
      prevSetNHIFulfilled !== undefined &&
      !prevSetNHIFulfilled &&
      setNHIFulfilled
    ) {
      recordAnalyticEvent(
        isEdit ? AnalyticsEvent.EditNhi : AnalyticsEvent.AddNhi,
      );
      props.navigation.navigate(NHIScreen.Added);
    }
  }, [setNHIFulfilled, prevSetNHIFulfilled, props.navigation, user, isEdit]);

  const title = useRef(
    user?.nhi ? t("screenTitles:editNHI") : t("screenTitles:addNHI"),
  );

  useAccessibleTitle({ title: title.current });

  const clearErrorMessage = () => {
    setValidationError(undefined);
  };

  return (
    <FormV2
      buttonTestID="addNhi:next"
      buttonText={t("screens:buttonNHI:save")}
      onButtonPress={handleSubmit}
      keyboardAvoiding={true}
    >
      <View>
        <Title>{t("screens:addNHI:title")}</Title>

        <VerticalSpacing />

        <Description>{t("screens:addNHI:description")}</Description>

        <VerticalSpacing />

        <InputGroup onSubmit={handleSubmit} ref={inputGroupRef}>
          <TextInput
            identifier="nhiValue"
            {...presets.alphaNumericCode}
            marginBottom={grid}
            label="NHI"
            testID="addNhi:input"
            errorMessage={validationError}
            clearErrorMessage={clearErrorMessage}
            onChangeText={setNhiValue}
            value={nhiValue}
            required="required"
          />
        </InputGroup>

        <More
          text={t("screens:addNHI:moreTitle")}
          onPress={toggleShowMore}
          isOpen={showMore}
        />

        {showMore && (
          <Tip backgroundColor={colors.lightYellow}>
            <TipText>{t("screens:addNHI:more1")}</TipText>
            <TipText>{t("screens:addNHI:more2")}</TipText>
            <TipText>{t("screens:addNHI:more3")}</TipText>
            <TipText>{t("screens:addNHI:more4")}</TipText>
            <TipText>{t("screens:addNHI:more5")}</TipText>
            <TipText>{t("screens:addNHI:more6")}</TipText>
            <TipText>{t("screens:addNHI:more7")}</TipText>
            <TipText>{t("screens:addNHI:more8")}</TipText>
          </Tip>
        )}
      </View>
    </FormV2>
  );
}
