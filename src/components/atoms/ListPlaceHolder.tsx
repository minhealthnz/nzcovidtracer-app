import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

import { PlaceHolder } from "./PlaceHolder";
import { VerticalSpacing } from "./VerticalSpacing";

export const Container = styled.View`
  padding: 20px 16px;
`;

type Props = {
  numberOfItems?: number;
};

export function ListPlaceHolder({ numberOfItems = 6 }: Props) {
  const renderPlaceHolder = () => {
    const items = [];
    for (let i = 0; i < numberOfItems; i++) {
      items.push(
        <View key={`placeholder_${i}`}>
          <PlaceHolder key={i} />
          <VerticalSpacing height={10} />
        </View>,
      );
    }
    return items;
  };

  return <Container>{renderPlaceHolder()}</Container>;
}
