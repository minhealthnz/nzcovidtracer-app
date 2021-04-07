import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
  ViewStyle,
} from "react-native";
import styled from "styled-components/native";

import { testable } from "../../testable";
import { VerticalSpacing } from "./VerticalSpacing";

interface Props {
  image: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  text?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  imageStyle?: ImageStyle;
}

const TouchableOpacity = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  line-height: 16px;
  color: ${colors.primaryGray};
  margin-top: 5px;
`;

function ImageButton(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={props.style}
      accessible={true}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityHint={props.accessibilityHint}
      accessibilityRole="button"
    >
      {
        // Add a top padding here to vertically center with text
        !!props.text && <VerticalSpacing height={4} />
      }
      <Image source={props.image} style={props.imageStyle} />
      {!!props.text && <ButtonText>{props.text}</ButtonText>}
    </TouchableOpacity>
  );
}

export default testable(ImageButton);
