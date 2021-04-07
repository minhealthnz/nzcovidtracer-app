import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import { formatToLocaleString } from "@utils/formatToLocaleString";
import React, { useCallback, useMemo, useState } from "react";
import { ImageSourcePropType, PixelRatio } from "react-native";
import FastImage from "react-native-fast-image";
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

const Icon = styled.Image`
  width: 40px;
  height: 40px;
  margin-left: ${grid2x}px;
  margin-vertical: ${grid}px;
`;

const RemoteIconView = styled.View`
  width: 40px;
  height: 40px;
  margin-left: ${grid2x}px;
  margin-vertical: ${grid}px;
`;

const RemoteIcon = styled(FastImage)`
  width: 40px;
  height: 40px;
`;

const PlaceholderIcon = styled.Image`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
`;

const TrendView = styled.View<{ isGood?: boolean; backgroundColor: string }>`
  height: 16px;
  flex-direction: row;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const TrendIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: -8px;
`;

const TrendText = styled(Text)<{
  isGood?: boolean;
  fontColor: string;
}>`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  color: ${(props) => props.fontColor};
  margin-right: 6px;
  margin-left: 5px;
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

const StatisticTitle = styled(Text)`
  font-size: ${fontSizes.xxxxLarge}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 36px;
  padding-top: 13px;
  margin-bottom: -25px;
  margin-right: 5px;
`;

const Description = styled(Text)<{ isError?: boolean }>`
  line-height: 16px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${(props) =>
    props.isError ? colors.primaryBlack : colors.primaryGray};
`;

const assets = {
  chevron: require("@assets/icons/chevron-right.png"),
  trendUpGreen: require("@assets/icons/trend-up-green.png"),
  trendUpRed: require("@assets/icons/trend-up-red.png"),
  trendDownGreen: require("@assets/icons/trend-down-green.png"),
  trendDownRed: require("@assets/icons/trend-down-red.png"),
  launch: require("@assets/icons/launch.png"),
};

interface Props {
  testID?: string;
  headerImage: ImageSourcePropType | string;
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
}

export const Card = ({
  headerImage,
  title,
  description,
  isImportant,
  accessibilityHint,
  accessibilityLabel,
  backgroundColor,
  isStatistic,
  dailyChange,
  dailyChangeIsGood,
  isError,
  onPress,
  isLink,
  isConnected,
}: Props) => {
  const getScaledAssetUrl = useCallback((url: string) => {
    const fileExtensionIndex = url.indexOf(".png");
    if (fileExtensionIndex < 0) {
      return url;
    }
    const newUrl = url.slice(0, fileExtensionIndex);
    const scaleFactor = PixelRatio.get();
    if (scaleFactor > 2) {
      return `${newUrl}@3x.png`;
    }
    if (scaleFactor > 1) {
      return `${newUrl}@2x.png`;
    }
    return url;
  }, []);

  //TODO: Refactor to move daily change logic out of Card component

  const [iconLoaded, setIconLoaded] = useState(false);

  const isString = typeof dailyChange === "string";

  const hidePill = dailyChangeIsGood === undefined && isString;

  const hideIcon = isString;

  const trendFontColor = useMemo(() => {
    if (hidePill) {
      return colors.primaryBlack;
    }
    return dailyChangeIsGood ? colors.primaryBlack : colors.white;
  }, [hidePill, dailyChangeIsGood]);

  const trendBackgroundColor = useMemo(() => {
    if (hidePill) {
      return "transparent";
    }
    return dailyChangeIsGood === undefined
      ? colors.darkGrey
      : dailyChangeIsGood
      ? colors.green
      : colors.red;
  }, [hidePill, dailyChangeIsGood]);

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

      {typeof headerImage === "string" ? (
        <RemoteIconView>
          {!iconLoaded && (
            <PlaceholderIcon
              source={require("@features/dashboard/assets/icons/information.png")}
            />
          )}
          <RemoteIcon
            source={{
              uri: getScaledAssetUrl(headerImage),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            onLoad={() => setIconLoaded(true)}
          />
        </RemoteIconView>
      ) : (
        <Icon source={headerImage} width={40} height={40} />
      )}

      <TextContainer>
        <TitleView>
          {title ? (
            isStatistic ? (
              <StatisticTitle>{formatToLocaleString(title)}</StatisticTitle>
            ) : (
              <Title>{title}</Title>
            )
          ) : null}
          {!!dailyChange && dailyChange !== 0 && (
            <TrendView
              isGood={dailyChangeIsGood}
              backgroundColor={trendBackgroundColor}
            >
              {!hideIcon && (
                <TrendIcon
                  source={
                    dailyChangeIsGood
                      ? dailyChange > 0
                        ? assets.trendUpGreen
                        : assets.trendDownGreen
                      : dailyChange > 0
                      ? assets.trendUpRed
                      : assets.trendDownRed
                  }
                />
              )}
              <TrendText
                isGood={dailyChangeIsGood}
                fontColor={trendFontColor}
                fontSize={hidePill ? 15 : 10}
              >
                {formatToLocaleString(dailyChange)}
              </TrendText>
            </TrendView>
          )}
        </TitleView>
        {!!description && (
          <Description isError={isError}>{description}</Description>
        )}
      </TextContainer>

      {onPress &&
        (isLink ? (
          <ExternalLink source={assets.launch} />
        ) : (
          <Chevron source={assets.chevron} />
        ))}
    </Container>
  );
};
