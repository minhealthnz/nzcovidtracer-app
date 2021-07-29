import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { useAppDispatch } from "@lib/useAppDispatch";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  findNodeHandle,
  LayoutChangeEvent,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";

import { removeFavourite } from "../actions/removeFavourite";
import { Location } from "../types";
import { LocationSuccessContext } from "./LocationSuccessContextProvider";

const MainView = styled(Animated.View)`
  width: 100%;
  background-color: ${colors.green}
  position: absolute;
  top: 0;
`;

const TextView = styled.View`
  padding-horizontal: ${grid2x}px;
  padding-vertical: ${grid}px;
  flex-direction: row;
  justify-content: space-between;
`;

const MainText = styled(Text)`
  color: ${colors.primaryBlack};
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  flex: 1;
  padding-right: ${grid}px;
`;

const BottomBorder = styled.View`
  background-color: ${colors.black};
  height: 4px;
  width: 100%;
  opacity: 0.3;
`;

const UndoButton = styled(Text)`
  color: ${colors.primaryBlack};
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 20px;
  text-decoration: underline;
`;

const BANNER_OFFSET_VISIBLE = 0;
const ANIMATION_DURATION = 250;

export function AddLocationSuccessBanner() {
  const { location, setLocationId } = useContext(LocationSuccessContext);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isAccessible, setIsAccessible] = useState(false);

  const mainViewHeight = useRef(100);

  const bannerYTranslation = useMemo(
    () => new Animated.Value(-mainViewHeight.current),
    [],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      mainViewHeight.current = event.nativeEvent.layout.height;
      bannerYTranslation.setValue(-mainViewHeight.current);
    },
    [mainViewHeight, bannerYTranslation],
  );

  const [lastSeenLocation, setLastSeenLocation] = useState<
    Location | undefined
  >(undefined);

  const bannerRef = useRef(null);

  useEffect(() => {
    const reactTag = findNodeHandle(bannerRef.current);
    if (reactTag && isAccessible) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }, [bannerRef, isAccessible]);

  useEffect(() => {
    if (!location) {
      setIsAccessible(false);
      Animated.timing(bannerYTranslation, {
        toValue: -mainViewHeight.current,
        useNativeDriver: true,
        duration: ANIMATION_DURATION,
        easing: Easing.cubic,
      }).start(() => {
        setLastSeenLocation(undefined);
      });
      return;
    }
    if (!!location && location.id !== lastSeenLocation?.id) {
      if (!lastSeenLocation) {
        setIsAccessible(true);
        Animated.timing(bannerYTranslation, {
          toValue: BANNER_OFFSET_VISIBLE,
          useNativeDriver: true,
          duration: ANIMATION_DURATION,
          easing: Easing.cubic,
        }).start();
      }
      setLastSeenLocation(location);
    }
  }, [
    lastSeenLocation,
    location,
    dispatch,
    bannerYTranslation,
    setIsAccessible,
  ]);

  const onPressUndo = useCallback(() => {
    if (!location) {
      return;
    }
    dispatch(removeFavourite({ locationId: location.id }));
    setLocationId(undefined);
  }, [dispatch, location, setLocationId]);

  return (
    <MainView
      style={{ transform: [{ translateY: bannerYTranslation }] }}
      onLayout={handleLayout}
    >
      <TextView>
        <MainText
          numberOfLines={1}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
        >
          {t("screens:saveNewLocation:successBanner", {
            name: lastSeenLocation?.name,
          })}
        </MainText>
        {isAccessible && (
          <TouchableOpacity
            onPress={onPressUndo}
            ref={bannerRef}
            accessibilityLabel={t(
              "screens:saveNewLocation:successBannerAccessibilityLabel",
            )}
            accessibilityHint={t(
              "screens:saveNewLocation:successBannerAccessibilityHint",
            )}
          >
            <UndoButton>{t("screens:saveNewLocation:undo")}</UndoButton>
          </TouchableOpacity>
        )}
      </TextView>
      <BottomBorder />
    </MainView>
  );
}
