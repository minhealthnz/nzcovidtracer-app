import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid2x } from "@constants";
import { DiaryEntry } from "@features/diary/types";
import moment from "moment";
import React, { Component } from "react";
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

const assets = {
  chevronRight: require("@assets/icons/chevron-right.png"),
};

interface Props {
  entry: DiaryEntry;
  onPress?: () => void;
}

export class DiaryEntryListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.entry.updatedAt !== nextProps.entry.updatedAt;
  }
  render() {
    const entryDate = moment(this.props.entry.startDate);
    const dayText = entryDate.format("dddd");
    const dateText = entryDate.format("D MMMM YYYY");
    const timeText = entryDate.format("h:mma");

    const accessibilityLabel = [
      this.props.entry.name,
      dayText,
      dateText,
      timeText,
    ].join(" ");

    return (
      <Container
        onPress={this.props.onPress}
        disabled={!this.props.onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={this.props.onPress ? "button" : "text"}
      >
        <TextContainer>
          <NameText numberOfLines={1}>{this.props.entry.name}</NameText>
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
