import { CloseButton } from "@components/atoms/CloseButton";
import { SectionList } from "@components/atoms/SectionList";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import pupa from "pupa";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  findNodeHandle,
  FlatList,
  ImageProps,
} from "react-native";
import styled from "styled-components/native";

import { Card } from "./Card";

interface ActionSheetSectionItem {
  title: string;
  subTitle: string;
  onPress?: () => void;
  icon?: ImageProps;
  isLink?: boolean;
}

export interface ActionSheetSectionItems {
  title: string;
  data: ActionSheetSectionItem[];
}

interface Props {
  title: string;
  items?: ActionSheetSectionItems[]; // This is for section list
  flatItems?: ActionSheetSectionItem[]; // This is for flat list without section headers
  onDisMiss: () => void;
}

const Container = styled.View`
  padding-vertical: ${grid2x}px;
  background-color: ${colors.white};
  width: 100%;
  min-height: 250px;
  z-index: 999;
`;

const TitleView = styled.View`
  padding-bottom: ${grid}px;
`;

const Title = styled.Text`
  text-align: center;
  font-family: ${fontFamilies["baloo-bold"]};
  font-size: ${fontSizes.normal}px;
`;

const Separator = styled.View`
  background-color: ${colors.platinum};
  height: 1px;
`;

const TitleSeparator = styled.View`
  padding-vertical: ${grid}px;
  padding-horizontal: ${grid2x}px;
`;

const SectionHeader = styled.Text`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  color: ${colors.primaryGray};
  margin-top: ${grid2x}px;
`;

export function ActionSheet(props: Props) {
  const { t } = useTranslation();

  const totalActionSheetItems = useMemo(() => {
    if (props && props.items) {
      return props.items.reduce(
        (acc, val) => acc.concat(val.data),
        [] as ActionSheetSectionItem[],
      );
    }

    return [];
  }, [props]);

  const actionSheetRef = useRef(null);

  useEffect(() => {
    const reactTag = findNodeHandle(actionSheetRef.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
      setTimeout(() => {
        // Accessibility Focus is blocked by the modal view
        // Delay 1000ms to focus on the actionsheet title after modal view is focused
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }, 900);
    }
  }, [actionSheetRef]);

  const renderRow = useCallback(
    ({ item }) => {
      const findIndex = totalActionSheetItems.indexOf(item);
      const accessibilityHint = pupa(
        t("components:actionSheet:cardAccessibilityHint"),
        [findIndex + 1, totalActionSheetItems.length],
      );

      return (
        <Card
          title={item.title}
          description={item.subTitle}
          headerImage={item.icon}
          onPress={item.onPress}
          accessibilityLabel={[item.title, item.subTitle].join(" ")}
          accessibilityHint={accessibilityHint}
          isLink={item.isLink}
        />
      );
    },
    [t, totalActionSheetItems],
  );

  return (
    <Container>
      <TitleView>
        <Title
          accessibilityLabel={props.title}
          accessibilityRole="text"
          accessibilityHint={t("components:actionSheet:titleAccessibilityHint")}
          ref={actionSheetRef}
        >
          {props.title}
        </Title>
        <CloseButton onDismiss={props.onDisMiss} paddingTop={grid} />
      </TitleView>
      {props.flatItems ? (
        <>
          <TitleSeparator>
            <Separator />
          </TitleSeparator>
          <FlatList
            data={props.flatItems}
            keyExtractor={(item, index) => item.title + index}
            ItemSeparatorComponent={Separator}
            renderItem={renderRow}
          />
        </>
      ) : (
        <SectionList
          sections={props.items || []}
          keyExtractor={(item, index) => item.title + index}
          renderItem={renderRow}
          renderSectionHeader={({ section: { title } }) => (
            <>
              <Separator />
              <SectionHeader>{title}</SectionHeader>
            </>
          )}
          ItemSeparatorComponent={Separator}
        />
      )}
    </Container>
  );
}
