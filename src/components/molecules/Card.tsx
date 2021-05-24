import { Text } from "@components/atoms";
import { Image } from "@components/atoms/Image";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { formatToLocaleString } from "@utils/formatToLocaleString";
import React from "react";
import { ImageSourcePropType, ViewStyle } from "react-native";
import styled from "styled-components/native";

const Container = styled.TouchableOpacity<{
  backgroundColor?: string;
  minHeight?: number;
}>`
  background-color: ${(props) => props.backgroundColor || colors.white};
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: ${(props) => props.minHeight}px;
`;

const TextContainer = styled.View`
  flex-direction: column;
  flex: 1;
  padding: 12px 8px 12px 14px;
`;

const Chevron = styled.Image`
  margin-right: 21px;
`;

const ExternalLink = styled.Image`
  margin-right: 9px;
`;

const ImportantStripe = styled.View`
  height: 100%;
  width: ${grid}px;
  background-color: ${colors.yellow};
  position: absolute;
  top: 0;
  left: 0;
`;

const TitleView = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 20px;
  padding-top: 4px;
`;

const Description = styled(Text)<{ isError?: boolean }>`
  line-height: 16px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${(props) =>
    props.isError ? colors.primaryBlack : colors.primaryGray};
`;

const ImageContainer = styled.View`
  margin-left: ${grid2x}px;
  margin-vertical: ${grid}px;
`;

const assets = {
  chevron: require("@assets/icons/chevron-right.png"),
  launch: require("@assets/icons/launch.png"),
};

export interface CardProps {
  testID?: string;
  headerImage?: ImageSourcePropType | string;
  title?: string;
  description?: string;
  onPress?: () => void;
  isImportant?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  backgroundColor?: string;
  isStatistic?: boolean;
  dailyChange?: number | string;
  dailyChangeIsGood?: boolean;
  isError?: boolean;
  isLink?: boolean;
  isConnected?: boolean;
  titleAccessoryView?: React.ReactNode;
  titleStyle?: ViewStyle;
}

export const Card = ({
  headerImage,
  title,
  description,
  isImportant,
  accessibilityHint,
  accessibilityLabel,
  backgroundColor,
  isError,
  onPress,
  isLink,
  isConnected,
  titleAccessoryView,
  titleStyle,
}: CardProps) => {
  return (
    <Container
      minHeight={isConnected ? 65 : 80}
      onPress={onPress}
      accessible={true}
      accessibilityRole={onPress ? (isLink ? "link" : "button") : "none"}
      accessibilityLabel={
        accessibilityLabel || (description ? `${title}, ${description}` : title)
      }
      accessibilityHint={accessibilityHint}
      activeOpacity={0.7}
      backgroundColor={backgroundColor}
    >
      {isImportant && <ImportantStripe />}

      {!!headerImage && (
        <ImageContainer>
          <Image source={headerImage} width={40} height={40} />
        </ImageContainer>
      )}

      <TextContainer>
        <TitleView>
          {title ? (
            <Title style={titleStyle}>{formatToLocaleString(title)}</Title>
          ) : null}
          {titleAccessoryView}
        </TitleView>
        {!!description && (
          <Description isError={isError}>{description}</Description>
        )}
      </TextContainer>

      {onPress &&
        (isLink ? (
          <ExternalLink source={assets.launch} />
        ) : (
          <Chevron resizeMode="contain" source={assets.chevron} />
        ))}
    </Container>
  );
};
