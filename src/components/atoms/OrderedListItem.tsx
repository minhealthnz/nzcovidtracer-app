import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import styled from "styled-components/native";

import { Text } from "./Text";

interface Props {
  order: string;
  item: string;
}

const OrderedListRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-right: 24px;
`;

const Order = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  color: ${colors.black};
  padding-right: 11px;
`;

const Item = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  color: ${colors.primaryBlack};
`;

export function OrderedListItem({ order, item }: Props) {
  return (
    <OrderedListRow>
      <Order>{order}</Order>
      <Item>{item}</Item>
    </OrderedListRow>
  );
}
