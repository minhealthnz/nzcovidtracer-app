import { Text } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid, grid2x } from "@constants";
import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

const Container = styled.TouchableOpacity`
  background-color: ${colors.white};
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: 80px;
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

const Chevron = styled.Image`
  margin-right: ${grid2x}px;
`;

const ImportantStripe = styled.View`
  height: 100%;
  width: ${grid}px;
  background-color: ${colors.yellow};
  position: absolute;
  top: 0;
  left: 0;
`;

const Title = styled(Text)`
  font-size: ${fontSizes.normal}px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  line-height: 20px;
  padding-top: 4px;
`;

const Description = styled(Text)`
  margin-top: -2px;
  line-height: 16px;
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryGray};
`;

const assets = {
  chevron: require("@assets/icons/chevron-right.png"),
};

interface Props {
  testID?: string;
  headerImage: ImageSourcePropType;
  title: string;
  description?: string;
  onPress: () => void;
  isImportant?: boolean;
  accessibilityHint?: string;
}

export const Card = ({
  headerImage,
  title,
  description,
  isImportant,
  accessibilityHint,
  onPress,
}: Props) => {
  return (
    <Container
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={description ? `${title}, ${description}` : title}
      accessibilityHint={accessibilityHint}
      activeOpacity={0.7}
    >
      {isImportant && <ImportantStripe />}

      <Icon source={headerImage} width={40} height={40} />

      <TextContainer>
        <Title>{title}</Title>
        {!!description && <Description>{description}</Description>}
      </TextContainer>

      <Chevron source={assets.chevron} />
    </Container>
  );
};
