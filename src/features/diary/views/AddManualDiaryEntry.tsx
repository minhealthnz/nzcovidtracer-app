import {
  DatePicker,
  InputGroup,
  LocationIcon,
  TextInput,
} from "@components/atoms";
import { FormLocationConfirmField } from "@components/atoms/FormLocationConfirmField";
import { FormV2 } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import { grid, grid2x } from "@constants";
import { selectUserId } from "@domain/user/selectors";
import { AddDiaryEntry, addEntry } from "@features/diary/reducer";
import { getLocationName } from "@features/locations/helper";
import { useLocationAccessibility } from "@features/locations/hooks/useLocationAccessibility";
import { ScanScreen } from "@features/scan/screens";
import { isOutsideNZ } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { createLogger } from "@logger/createLogger";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import { calcCheckInMaxDate, calcCheckInMinDate } from "@utils/checkInDate";
import {
  detailsValidation,
  placeOrActivityValidation,
  startDateValidation,
} from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { useStartDate } from "../hooks/useStartDate";
import { DiaryScreen } from "../screens";

const { logError } = createLogger("AddManualDiaryEntry.tsx");

interface Props
  extends StackScreenProps<MainStackParamList, DiaryScreen.AddEntryManually> {}

const schema = yup.object().shape({
  name: placeOrActivityValidation,
  startDate: startDateValidation,
  details: detailsValidation,
});

const newDate = new Date().getTime();
const coeff = 1000 * 60 * 5;

export function AddManualDiaryEntry(props: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const date = props.route.params?.startDate || newDate;
  const location = props.route.params?.location || "";
  const name = getLocationName(location);
  const address = typeof location === "object" ? location.address : undefined;
  const type = typeof location === "object" ? location.type : "manual";
  const isFavourite =
    typeof location === "object" ? location.isFavourite : false;
  const globalLocationNumber =
    typeof location === "object" && location.type === "scan"
      ? location.id
      : undefined;

  const rounded = useMemo(
    () => new Date(Math.round(date / coeff) * coeff),
    [date],
  );

  const [nameError, setNameError] = useState<string>("");
  const [startDate, setDate] = useStartDate(rounded.getTime());
  const [dateError, setDateError] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [detailsError, setDetailsError] = useState<string>("");

  const minimumDate = useRef(calcCheckInMinDate());
  const maximumDate = useRef(calcCheckInMaxDate());

  const cleanErrorMessages = () => {
    setNameError("");
    setDateError("");
    setDetailsError("");
  };

  useEffect(() => {
    setDate(rounded.getTime());
  }, [rounded, setDate]);

  const onDetailsChange = (text: string) => {
    setDetails(text);
  };

  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (name != null) {
      setNameError("");
    }
  }, [name]);

  const saved = useRef(false);

  const onSavePress = useCallback(() => {
    if (saved.current) {
      return;
    }

    Keyboard.dismiss();

    if (userId == null) {
      logError("Cannot find userId [screen=AddManualDiaryEntry]");
      return;
    }

    cleanErrorMessages();
    schema
      .validate(
        {
          name,
          startDate,
          details,
        },
        { abortEarly: false },
      )
      .then(() => {
        const request: AddDiaryEntry = {
          name,
          userId,
          details: details ?? "",
          id: nanoid(),
          startDate: new Date(startDate),
          address,
          type: type,
          globalLocationNumber: globalLocationNumber,
        };

        return dispatch(addEntry(request));
      })
      .then(unwrapResult)
      .then((entry) => {
        saved.current = true;
        props.navigation.pop();
        props.navigation.replace(ScanScreen.Recorded, {
          id: entry.id,
          manualEntry: true,
        });
      })
      .catch((error: yup.ValidationError | Error) => {
        if (error instanceof yup.ValidationError && error.inner) {
          error.inner.forEach((item) => {
            switch (item.path) {
              case "name":
                setNameError(t(item.message));
                break;
              case "startDate":
                setDateError(t(item.message));
                break;
              case "details":
                setDetailsError(t(item.message));
                break;
            }
          });

          inputGroupRef.current?.focusError(...error.inner.map((x) => x.path));
        } else {
          logError("Failed to save entry", error);
          props.navigation.navigate(ScanScreen.ScanNotRecorded);
        }
      });
  }, [
    props.navigation,
    t,
    dispatch,
    details,
    startDate,
    userId,
    name,
    address,
    type,
    globalLocationNumber,
  ]);

  useAccessibleTitle();

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  const onPlaceOrActivityPress = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  const { locationIconAccessibilityLabel } = useLocationAccessibility({
    isFavourite: isFavourite,
    locationType: type,
  });

  const locationConfirmationAccessibilityLabel = useMemo(() => {
    if (name) {
      return t(
        "screens:addManualDiaryEntry:locationConfirmationAccessibilityLabel",
        {
          locationType: locationIconAccessibilityLabel,
          locationName: name,
        },
      );
    } else {
      return undefined;
    }
  }, [locationIconAccessibilityLabel, name, t]);

  return (
    <FormV2
      buttonTestID="addManualDiaryEntry:save"
      buttonText={t("screens:addManualDiaryEntry:save")}
      onButtonPress={onSavePress}
      keyboardAvoiding={true}
      paddingTop={grid2x}
      step={t("screens:addManualDiaryEntry:stepTwoOfTwo")}
      heading={t("screens:addManualDiaryEntry:details")}
    >
      <InputGroup ref={inputGroupRef}>
        <FormLocationConfirmField
          buttonText={t("screens:addManualDiaryEntry:change")}
          identifier="name"
          onPress={onPlaceOrActivityPress}
          label={t("screens:addManualDiaryEntry:placeOrActivity")}
          value={name}
          required="required"
          errorMessage={nameError}
          accessibilityLabel={locationConfirmationAccessibilityLabel}
          renderIcon={
            !!location && (
              <LocationIcon
                locationType={type}
                isFavourite={isFavourite}
                alignLeft={true}
              />
            )
          }
        />

        <DatePicker
          info={
            isOutsideNZ()
              ? t("screens:addManualDiaryEntry:timeInNZT")
              : undefined
          }
          dateTime={startDate}
          onDateChange={setDate}
          errorMessage={dateError}
          clearErrorMessage={() => setDateError("")}
          label={t("screens:addManualDiaryEntry:datePicker")}
          maximumDate={maximumDate.current}
          minimumDate={minimumDate.current}
          minuteInterval={5}
        />
        <TextInput
          identifier="details"
          testID="addManualDiaryEntry:addANote"
          label={t("screens:addManualDiaryEntry:addANote")}
          value={details}
          onChangeText={onDetailsChange}
          info={t("screens:addManualDiaryEntry:disclaimer")}
          required="optional"
          errorMessage={detailsError}
          clearErrorMessage={() => setDetailsError("")}
          multiline={true}
          numberOfLines={4}
          returnKeyType="default"
          marginBottom={grid}
        />
      </InputGroup>
    </FormV2>
  );
}
