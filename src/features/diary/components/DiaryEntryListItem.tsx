import { LocationIcon, Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import { isAndroid, isOutsideNZ } from "@lib/helpers";
import CheckBox from "@react-native-community/checkbox";
import moment from "moment-timezone";
import pupa from "pupa";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.TouchableOpacity<{ isChecked: boolean | undefined }>`
  background-color: ${(props) =>
    props.isChecked ? colors.yellow : colors.white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: ${grid2x}px;
  padding-left: ${grid}px;
  min-height: 64px;
`;

const TextContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding: ${grid}px;
`;

const NameContainer = styled.View`
  flex-direction: row;
  padding-right: 16px;
`;

const DateTextContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const NameText = styled(Text)`
  font-family: ${fontFamilies["baloo-semi-bold"]};
  font-size: ${fontSizes.normal}px;
  line-height: 20px;
  color: ${colors.primaryBlack};
  padding-top: 4px;
`;

const DateText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryGray};
  margin-right: 15px;
`;

const Chevron = styled.Image`
  margin-left: ${grid}px;
`;

const Warning = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;

const assets = {
  chevronRight: require("@assets/icons/chevron-right.png"),
  warning: require("@assets/icons/attention.png"),
  error: require("@features/dashboard/assets/icons/error.png"),
};

interface Props extends WithTranslation {
  hideDay?: boolean;
  hideDate?: boolean;
  showCheckboxes?: boolean;
  isChecked?: boolean;
  entry: DiaryEntry;
  accessibilityLabel?: string;
  onEntryPress?: () => void;
  onCheckboxValChange?: (id: DiaryEntry, val: boolean) => void;
}

class _DiaryEntryListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.isChecked !== nextProps.isChecked ||
      this.props.entry.updatedAt !== nextProps.entry.updatedAt ||
      this.props.entry.isFavourite !== nextProps.entry.isFavourite ||
      this.props.entry.startDate !== nextProps.entry.startDate
    );
  }

  getAccessibilityObject = (
    dayText: string,
    dateText: string,
    timeText: string,
  ) => {
    const { t, showCheckboxes, entry, isChecked } = this.props;
    const isRisky = entry?.isRisky;

    let accessibilityHint = t(
      "components:diaryEntryListItem:locationAccessibilityHint",
    );

    let locationAccessibilityLabel = isRisky
      ? t("components:diaryEntryListItem:locationAccessibilityLabel")
      : "";

    if (showCheckboxes) {
      // Update the accessibility label
      locationAccessibilityLabel = `${locationAccessibilityLabel} ${
        isChecked
          ? t("components:diaryEntryListItem:doubleTapUnselect")
          : t("components:diaryEntryListItem:doubleTapSelect")
      }`;

      // Update the accessibility hint
      accessibilityHint = pupa(t("components:diaryEntryListItem:diaryEntry"), {
        selected: isChecked ? t("components:diaryEntryListItem:selected") : "",
        type: t(
          `components:diaryEntryListItem:${
            this.props.entry.type === "manual" ? "manual" : "scan"
          }`,
        ),
      });
    }

    const accessibilityLabel = [
      this.props.entry.name,
      `${dayText} ${dateText} ${timeText}`,
      this.props.accessibilityLabel || "",
      locationAccessibilityLabel,
    ].join(". ");

    return {
      accessibilityLabel,
      accessibilityHint,
    };
  };

  getRightElement = () => {
    const { showCheckboxes, isChecked } = this.props;
    let rightEl = null;

    if (this.props.onEntryPress) {
      rightEl = <Chevron resizeMode="contain" source={assets.chevronRight} />;
    }

    // If list item has checkboxes
    if (showCheckboxes) {
      // Show checkboxes on the right
      rightEl = (
        <>
          <View style={isAndroid ? styles.checkboxContainer : null}>
            <View style={isAndroid ? styles.checkboxBackground : null} />
            <CheckBox
              style={styles.checkbox}
              disabled={false}
              value={isChecked}
              boxType="square"
              tintColors={{ true: colors.black, false: colors.black }}
              tintColor={colors.black}
              onCheckColor={colors.black}
              onTintColor={colors.black}
              animationDuration={0.1}
              onValueChange={(newValue) => {
                if (this.props.onCheckboxValChange) {
                  this.props.onCheckboxValChange(this.props.entry, newValue);
                }
              }}
            />
          </View>
        </>
      );
    }

    return rightEl;
  };

  render() {
    const entryDate = moment(this.props.entry.startDate);
    const dayText = entryDate.format("dddd");
    const dateText = entryDate.format("D MMMM YYYY");
    const timeText = entryDate.format("h:mma");
    const isRisky = this.props.entry.isRisky;
    const isChecked = this.props.isChecked;
    const {
      accessibilityHint,
      accessibilityLabel,
    } = this.getAccessibilityObject(dayText, dateText, timeText);

    return (
      <Container
        isChecked={!!this.props.isChecked}
        onPress={this.props.onEntryPress}
        disabled={!this.props.onEntryPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={this.props.onEntryPress ? "button" : "text"}
      >
        <LocationIcon
          locationType={this.props.entry.type}
          isFavourite={this.props.entry.isFavourite}
        />
        <TextContainer>
          <NameContainer>
            <NameText numberOfLines={1}>{this.props.entry.name}</NameText>
            {isRisky && (
              <Warning source={isChecked ? assets.error : assets.warning} />
            )}
          </NameContainer>
          <DateTextContainer>
            {!this.props.hideDate && <DateText>{dateText}</DateText>}
            {!this.props.hideDay && <DateText>{dayText}</DateText>}
            <DateText>{`${timeText}${isOutsideNZ() ? " NZT" : ""}`}</DateText>
          </DateTextContainer>
        </TextContainer>
        {this.getRightElement()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  checkbox: {
    height: 18,
    width: 18,
    zIndex: 1,
    marginRight: isAndroid ? 14 : 5,
    backgroundColor: isAndroid ? "transparent" : colors.white,
  },
  checkboxBackground: {
    backgroundColor: colors.white,
    height: 14,
    width: 14,
    position: "absolute",
    left: 9,
    top: 2,
  },
  checkboxContainer: {
    position: "relative",
  },
});

export const DiaryEntryListItem = withTranslation()(_DiaryEntryListItem);
