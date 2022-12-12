import { selectUser } from "@domain/user/selectors";
import { DiaryScreen } from "@features/diary/screens";
import { selectHasOldDiary } from "@features/diary/selectors";
import { ENFScreen } from "@features/enf/screens";
import { LocationScreen } from "@features/locations/screens";
import { selectHasFavourites } from "@features/locations/selectors";
import { NHIScreen } from "@features/nhi/screens";
import { createOTPSession } from "@features/otp/reducer";
import { OTPScreen } from "@features/otp/screens";
import { selectIsVerified } from "@features/verification/selectors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { nanoid } from "@reduxjs/toolkit";
import { MainStackParamList } from "@views/MainStack";
import _ from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionListData } from "react-native";
import { useExposure } from "react-native-exposure-notification-service";
import { useDispatch, useSelector } from "react-redux";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { ProfileScreen } from "../screens";
import { ProfileItem } from "../types";

const assets = {
  diary: require("../assets/icons/diary.png"),
  savedLocations: require("../assets/icons/favourite.png"),
  details: require("../assets/icons/details.png"),
  location: require("../assets/icons/location.png"),
  nhi: require("../assets/icons/nhi.png"),
  send: require("../assets/icons/send.png"),
  notification: require("../assets/icons/notification.png"),
};

export function useProfileSections() {
  const currentUser = useSelector(selectUser);
  const hasNHI = useMemo(() => currentUser?.nhi, [currentUser]);
  const dispatch = useDispatch();
  const hasOldDiary = useSelector(selectHasOldDiary);
  const verified = useSelector(selectIsVerified);
  const { supported: enfSupported } = useExposure();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const showShareENF = enfSupported && verified;

  const diary = useMemo(
    () => ({
      headerImage: assets.diary,
      title: t("screens:profile:viewDiary"),
      onPress: () => {
        navigation.navigate(DiaryScreen.Diary);
      },
    }),
    [navigation, t],
  );

  const hasFavourites = useSelector(selectHasFavourites);

  const savedLocations = useMemo(
    () => ({
      headerImage: assets.savedLocations,
      title: t("screens:profile:savedLocations"),
      onPress: () => {
        if (hasFavourites) {
          navigation.navigate(LocationScreen.SavedLocations);
        } else {
          navigation.navigate(LocationScreen.SaveLocationOnboarding, {});
        }
      },
    }),
    [navigation, t, hasFavourites],
  );

  const nhi = useMemo(
    () => ({
      headerImage: assets.nhi,
      testID: "profile:nhi",
      title: hasNHI
        ? t("screens:profile:nhiDetailsHasNHI")
        : t("screens:profile:nhiDetails"),

      description: hasNHI
        ? t("screens:profile:nhiDescriptionHasNHI")
        : t("screens:profile:nhiDescription"),

      onPress: () => {
        if (hasNHI) {
          recordAnalyticEvent(AnalyticsEvent.ViewNHIFromMyProfile);
        }

        navigation.navigate(hasNHI ? NHIScreen.View : NHIScreen.Privacy);
      },
    }),
    [navigation, hasNHI, t],
  );

  const shareBluetoothTracing = useMemo(
    () =>
      showShareENF
        ? {
            headerImage: assets.send,
            testID: "profile:shareBluetooth",
            title: t("screens:profile:shareBluetooth"),
            description: t("screens:profile:shareBluetoothDescription"),
            onPress: () => {
              recordAnalyticEvent(AnalyticsEvent.ENFShareCodesMenuItemPressed);
              navigation.navigate(ENFScreen.Share);
            },
          }
        : null,
    [navigation, showShareENF, t],
  );

  const oldDiary = useMemo(
    () =>
      hasOldDiary
        ? {
            headerImage: assets.diary,
            title: t("screens:profile:recoverDiary"),
            onPress: () => {
              const sessionId = nanoid();
              dispatch(
                createOTPSession({
                  id: sessionId,
                  type: "viewDiary",
                  verifyEmailScreenTitle: t("screenTitles:chooseOldDiary"),
                  enterEmailScreenTitle: t("screenTitles:chooseOldDiary"),
                  mfaErrorHandling: "ignore",
                }),
              );
              navigation.navigate(OTPScreen.EnterEmail, {
                sessionId,
              });
            },
          }
        : null,
    [navigation, dispatch, hasOldDiary, t],
  );

  const settings = useMemo(
    () => ({
      headerImage: assets.notification,
      testID: "profile.notificationSettings",
      title: t("screens:profile:notificationPreferences"),
      onPress: () => {
        navigation.navigate(ProfileScreen.Settings);
      },
    }),
    [navigation, t],
  );
  const sections = useMemo(() => {
    const settingsSection = {
      title: t("screens:profile:headingSettings"),
      data: [settings],
      isLastSection: true,
    };

    const shareSection = showShareENF
      ? {
          title: t("screens:profile:headingSharePostive"),
          data: _.compact([shareBluetoothTracing]),
        }
      : null;

    const items: SectionListData<ProfileItem>[] = _.compact([
      {
        title: t("screens:profile:headingStorePrivate"),
        data: _.compact([diary, savedLocations, oldDiary, nhi]),
      },
      shareSection,
      settingsSection,
      {
        data: ["footer"],
        isLastSection: true,
      },
    ]);
    return items;
  }, [
    t,
    settings,
    showShareENF,
    shareBluetoothTracing,
    diary,
    savedLocations,
    oldDiary,
    nhi,
  ]);
  return sections;
}
