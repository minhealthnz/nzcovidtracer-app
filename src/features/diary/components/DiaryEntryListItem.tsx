import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import styled from "styled-components/native";

const Container = styled.TouchableOpacity`
  background-color: ${colors.white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${grid2x}px;
  min-height: 64px;
`;

const TextContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding: 8px 0 8px 0;
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
  margin-left: ${grid2x}px;
`;

const Warning = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;

const assets = {
  chevronRight: require("@assets/icons/chevron-right.png"),
  warning: require("@assets/icons/warning.png"),
};

interface Props extends WithTranslation {
  entry: DiaryEntry;
  onPress?: () => void;
}

class _DiaryEntryListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.entry.updatedAt !== nextProps.entry.updatedAt;
  }
  render() {
    const entryDate = moment(this.props.entry.startDate);
    const dayText = entryDate.format("dddd");
    const dateText = entryDate.format("D MMMM YYYY");
    const timeText = entryDate.format("h:mma");
    const isRisky = this.props.entry.isRisky;
    const t = this.props.t;

    const locationAccessibilityLabel = isRisky
      ? t("components:diaryEntryListItem:locationAccessibilityLabel")
      : "";

    const accessibilityLabel = [
      this.props.entry.name,
      dayText,
      dateText,
      timeText,
      locationAccessibilityLabel,
    ].join(" ");

    return (
      <Container
        onPress={this.props.onPress}
        disabled={!this.props.onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t(
          "components:diaryEntryListItem:locationAccessibilityHint",
        )}
        accessibilityRole={this.props.onPress ? "button" : "text"}
      >
        <TextContainer>
          <NameContainer>
            <NameText numberOfLines={1}>{this.props.entry.name}</NameText>
            {isRisky && <Warning source={assets.warning} />}
          </NameContainer>
          <DateTextContainer>
            <DateText>{dayText}</DateText>
            <DateText>{dateText}</DateText>
            <DateText>{timeText}</DateText>
          </DateTextContainer>
        </TextContainer>
        {this.props.onPress && <Chevron source={assets.chevronRight} />}
      </Container>
    );
  }
}

export const DiaryEntryListItem = withTranslation()(_DiaryEntryListItem);
