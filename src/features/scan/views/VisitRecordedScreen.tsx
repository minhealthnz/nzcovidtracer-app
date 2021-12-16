import {
  Button,
  InputGroup,
  Text,
  TextInput,
  VerticalSpacing,
} from "@components/atoms";
import { FocusAwareStatusBar } from "@components/atoms/FocusAwareStatusBar";
import { Card } from "@components/molecules/Card";
import { Description, FormV2, Heading } from "@components/molecules/FormV2";
import { InputGroupRef } from "@components/molecules/InputGroup";
import {
  colors,
  fontFamilies,
  fontSizes,
  grid,
  grid2x,
  grid3x,
} from "@constants";
import { selectPassDisabled, selectPassUrl } from "@features/device/selectors";
import { DiaryPercentage } from "@features/diary/components/DiaryPercentage";
import { EditDiaryEntry, editEntry } from "@features/diary/reducer";
import { DiaryScreen } from "@features/diary/screens";
import { selectCountActiveDays } from "@features/diary/selectors";
import { EntryPassAnalyticsType } from "@features/diary/types";
import { addFavourite } from "@features/locations/actions/addFavourite";
import { removeFavourite } from "@features/locations/actions/removeFavourite";
import { SaveLocationButton } from "@features/locations/components/SaveLocationButton";
import { LocationScreen } from "@features/locations/screens";
import { selectHasSeenLocationOnboarding } from "@features/locations/selectors";
import { selectLastScannedEntry } from "@features/nfc/selectors";
import useEntry from "@hooks/diary/useEntry";
import { isAndroid, isIOS } from "@lib/helpers";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { detailsValidation } from "@validations/validations";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import moment from "moment-timezone";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Keyboard, Linking, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { useDebouncedCallback } from "use-debounce";
import * as yup from "yup";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { ScanScreen } from "../screens";

const DateTimeText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryBlack};
`;

const EntryName = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  padding-top: 7px;
  margin-top: ${grid}px;
`;

const Divider = styled.View`
  width: 100%;
  background-color: ${colors.white};
  height: 1px;
  margin: 11px 0 ${grid2x}px 0;
`;

const TitleBox = styled.View`
  flex-direction: column;
  flex: 1;
  padding-left: 12px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
`;

const ManualDetailsTitle = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
`;

const ManualDetailsText = styled(Text)`
  margin-top: 3px;
  font-size: ${fontSizes.normal}px;
  padding-bottom: 30px;
`;

const HeaderContainer = styled.View<{
  backgroundColor: string;
  hasPaddingBottom?: boolean;
}>`
  padding-top: ${grid}px;
  padding-left: ${grid3x}px;
  padding-bottom: ${(props) => (props.hasPaddingBottom ? grid3x : 0)}px;
  padding-right: ${grid3x}px;
  background-color: ${(props) => props.backgroundColor};
`;

const schema = yup.object().shape({
  details: detailsValidation,
});

const assets = {
  successTick: require("@assets/icons/success-tick.png"),
  warning: require("@assets/icons/warning.png"),
  pass: require("@assets/icons/vaccine-pass.png"),
};

interface Props
  extends StackScreenProps<MainStackParamList, ScanScreen.Recorded> {}

export function VisitRecordedScreen(props: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [details, setDetails] = useState<string>();
  const [detailsError, setDetailsError] = useState<string>("");

  const entryId = props.route.params.id;
  const nfcDebounce = props.route.params.nfcDebounce;
  const manualEntry = props.route.params.manualEntry;

  const diaryEntry = useEntry(entryId);
  const manualDetails =
    diaryEntry.details || t("screens:visitRecorded:notProvided");

  const canEditDetails =
    (diaryEntry.type === "scan" ||
      diaryEntry.type === "nfc" ||
      diaryEntry.type === "link") &&
    !nfcDebounce &&
    !manualEntry;

  const numberOfDiaryEntries = useSelector(selectCountActiveDays);
  const totalEntryDay = 14;
  const lastScannedEntry = useSelector(selectLastScannedEntry);
  const passUrl = useSelector(selectPassUrl);
  const passDisabled = useSelector(selectPassDisabled);

  const hasSeenLocationOnboarding = useSelector(
    selectHasSeenLocationOnboarding,
  );

  const detailsCharLimit = 255;

  useEffect(() => {
    if (details) {
      const validatedDetails =
        details.length > detailsCharLimit
          ? details.slice(0, detailsCharLimit)
          : details;
      const editRequest: EditDiaryEntry = {
        id: diaryEntry.id,
        details: validatedDetails,
      };
      dispatch(editEntry(editRequest));
      setDetails("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScannedEntry.id, diaryEntry.id, diaryEntry.type, dispatch]);

  const handleEditSubmit = useCallback(() => {
    Keyboard.dismiss();
    schema
      .validate({ details })
      .then(() => {
        if (details) {
          const editRequest: EditDiaryEntry = {
            id: diaryEntry.id,
            details,
          };
          dispatch(editEntry(editRequest));
        }
        props.navigation.navigate(TabScreen.RecordVisit);
      })
      .catch((error: yup.ValidationError) => {
        setDetailsError(t(error.message));

        inputGroupRef.current?.focusError("details");
      });
  }, [details, diaryEntry, props.navigation, t, dispatch]);

  const handleDonePress = useDebouncedCallback(
    useCallback(() => {
      if (canEditDetails) {
        handleEditSubmit();
      } else {
        props.navigation.pop();
      }
    }, [props.navigation, canEditDetails, handleEditSubmit]),
    2000,
    {
      leading: true,
      trailing: false,
    },
  );

  const inputGroupRef = useRef<InputGroupRef | null>(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: nfcDebounce ? colors.platinum : colors.green,
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [nfcDebounce, props.navigation]);

  useFocusEffect(
    useCallback(() => {
      if (numberOfDiaryEntries === totalEntryDay) {
        recordAnalyticEvent(AnalyticsEvent.EntryComplete);
      }
    }, [numberOfDiaryEntries]),
  );

  const eventAnalyticEntry: EntryPassAnalyticsType = useMemo(() => {
    if (!!diaryEntry.globalLocationNumber && manualEntry) {
      return "manual";
    } else if (
      !!diaryEntry.globalLocationNumber &&
      !manualEntry &&
      diaryEntry.type === "scan"
    ) {
      return "scan";
    } else if (diaryEntry.type === "nfc") {
      return "nfc";
    } else if (diaryEntry.type === "link") {
      return "link";
    } else {
      return "manualWithoutGln";
    }
  }, [diaryEntry.globalLocationNumber, manualEntry, diaryEntry.type]);

  useFocusEffect(
    useCallback(() => {
      switch (eventAnalyticEntry) {
        case "scan":
        case "nfc":
        case "manual":
        case "link":
          recordAnalyticEvent(AnalyticsEvent.EntryPass, {
            attributes: {
              entryType: eventAnalyticEntry,
            },
          });
          break;
        case "manualWithoutGln":
          recordAnalyticEvent(AnalyticsEvent.EntryPassManual);
          break;
      }
    }, [eventAnalyticEntry]),
  );

  useAccessibleTitle();

  const handleDiaryPercentagePress = useDebouncedCallback(
    useCallback(() => {
      // Remove recorded page from stack
      props.navigation.pop();
      props.navigation.navigate(DiaryScreen.Diary);
    }, [props.navigation]),
    2000,
    {
      leading: true,
      trailing: false,
    },
  );

  const { tick, backgroundColor, statusBarColor } = useMemo(() => {
    if (nfcDebounce) {
      return {
        tick: assets.warning,
        backgroundColor: colors.platinum,
        statusBarColor: colors.platinum,
      };
    } else {
      return {
        tick: assets.successTick,
        backgroundColor: colors.green,
        statusBarColor: colors.green,
      };
    }
  }, [nfcDebounce]);

  const currentMoment = moment(diaryEntry.startDate);

  const handleSavePress = useCallback(() => {
    if (!hasSeenLocationOnboarding) {
      props.navigation.navigate(LocationScreen.SaveLocationOnboarding, {
        diaryEntry: diaryEntry,
        hasSeenLocationOnboarding: hasSeenLocationOnboarding,
      });
    } else {
      if (diaryEntry.isFavourite) {
        dispatch(
          removeFavourite({
            locationId: diaryEntry.locationId,
          }),
        );
      } else {
        dispatch(
          addFavourite({
            locationId: diaryEntry.locationId,
          }),
        );
      }
    }
  }, [dispatch, diaryEntry, hasSeenLocationOnboarding, props.navigation]);

  const renderButtonHeader = useMemo(() => {
    if (!passDisabled && (isAndroid || passUrl)) {
      const description = t(
        `screens:visitRecorded:${isIOS ? "openInAppleWallet" : "openGPay"}`,
      );
      return (
        <Card
          maxFontSizeMultiplier={1.5}
          isLink={true}
          title={t("screens:visitRecorded:viewPass")}
          description={description}
          headerImage={assets.pass}
          onPress={() => {
            recordAnalyticEvent(AnalyticsEvent.WalletOpen);
            Linking.openURL(
              isIOS
                ? passUrl
                  ? passUrl
                  : "shoebox://"
                : "https://pay.app.goo.gl/gettheapp-au",
            );
          }}
          accessibilityLabel={`${description} ${t(
            "screens:visitRecorded:viewPass",
          )}`}
          accessibilityHint={t("screens:visitRecorded:viewPassHint")}
        />
      );
    }

    return null;
  }, [passDisabled, passUrl, t]);

  const renderButton = useCallback(() => {
    return (
      <>
        {renderButtonHeader}
        <Button
          testID="visitRecorded:done"
          text={t("screens:visitRecorded:doneButton")}
          onPress={handleDonePress}
          accessibilityHint={t("screens:visitRecorded:doneHint")}
        />
      </>
    );
  }, [handleDonePress, renderButtonHeader, t]);

  if (diaryEntry == null) {
    return null;
  }

  return (
    <FormV2
      renderButton={renderButton}
      keyboardAvoiding={true}
      backgroundColor={colors.lightGrey}
      padding={0}
      snapButtonsToBottom={true}
    >
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={statusBarColor}
      />
      <HeaderContainer
        backgroundColor={backgroundColor}
        hasPaddingBottom={nfcDebounce}
      >
        <TitleContainer>
          <Image source={tick} />
          <TitleBox>
            <DateTimeText>
              {`${currentMoment.format(
                "D MMMM YYYY",
              )} at ${currentMoment.format("h:mm A")}`}
            </DateTimeText>
            <EntryName testID="visitRecorded:name">
              {!nfcDebounce ? diaryEntry.name : lastScannedEntry.name}
            </EntryName>
          </TitleBox>
          {!nfcDebounce && (
            <SaveLocationButton
              saved={diaryEntry.isFavourite}
              onPress={handleSavePress}
            />
          )}
        </TitleContainer>
        {canEditDetails && (
          <>
            <Divider />
            <VerticalSpacing height={10} />
            <InputGroup>
              <TextInput
                infoTextStyle={styles.infoText}
                identifier="details"
                label={t("screens:visitRecorded:addDetails")}
                required="optional"
                info={t("screens:visitRecorded:detailsDescription")}
                value={details}
                multiline={true}
                numberOfLines={2}
                onChangeText={setDetails}
                errorMessage={detailsError}
                clearErrorMessage={() => setDetailsError("")}
                returnKeyType="default"
              />
            </InputGroup>
          </>
        )}
        {manualEntry && (
          <>
            <Divider />
            <ManualDetailsTitle>Note</ManualDetailsTitle>
            <ManualDetailsText
              fontFamily={diaryEntry.details ? "open-sans" : "open-sans-italic"}
            >
              {manualDetails}
            </ManualDetailsText>
          </>
        )}
      </HeaderContainer>

      <View style={{ padding: grid3x, backgroundColor: colors.lightGrey }}>
        {nfcDebounce ? (
          <>
            <Heading>{t("screens:visitRecorded:heading")}</Heading>
            <Description>{t("screens:visitRecorded:description")}</Description>
          </>
        ) : (
          <DiaryPercentage onPress={handleDiaryPercentagePress} />
        )}
      </View>
    </FormV2>
  );
}

const styles = StyleSheet.create({
  infoText: {
    color: colors.primaryBlack,
  },
  modalView: {
    margin: 0,
    justifyContent: "flex-end",
  },
});
