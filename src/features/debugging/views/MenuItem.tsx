import { default as BaseDivider } from "@components/atoms/Divider";
import React from "react";
import styled from "styled-components/native";

import { cellBackgroundColor, detailColor } from "../colors";
import { borderRadius } from "../constants";

export interface MenuItemProps {
  title: string;
  detail?: string;
  onPress(): void;
  isFirst?: boolean;
  isLast?: boolean;
}

interface CellProps {
  isFirst?: boolean;
  isLast?: boolean;
}

const Cell = styled.TouchableOpacity<CellProps>`
  background-color: ${cellBackgroundColor};
  justify-content: center;
  padding-left: 12px;
  overflow: hidden;
  border-top-left-radius: ${(props: CellProps) =>
    props.isFirst ? borderRadius : "0"};
  border-top-right-radius: ${(props: CellProps) =>
    props.isFirst ? borderRadius : "0"};
  border-bottom-left-radius: ${(props: CellProps) =>
    props.isLast ? borderRadius : "0"};
  border-bottom-right-radius: ${(props: CellProps) =>
    props.isLast ? borderRadius : "0"};
  padding: 8px 12px;
`;

const Title = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
`;

const Detail = styled.Text`
  font-size: 12px;
  color: ${detailColor};
`;

const Divider = styled(BaseDivider)`
  background-color: #c8c7cc;
`;

const Background = styled.View<CellProps>`
  background-color: #fff;
  border-top-left-radius: ${(props: CellProps) =>
    props.isFirst ? borderRadius : "0"};
  border-top-right-radius: ${(props: CellProps) =>
    props.isFirst ? borderRadius : "0"};
  border-bottom-left-radius: ${(props: CellProps) =>
    props.isLast ? borderRadius : "0"};
  border-bottom-right-radius: ${(props: CellProps) =>
    props.isLast ? borderRadius : "0"};
`;

export function MenuItem({
  title,
  detail,
  onPress,
  isFirst,
  isLast,
}: MenuItemProps) {
  return (
    <Background isFirst={isFirst} isLast={isLast}>
      <Cell isFirst={isFirst} isLast={isLast} onPress={onPress}>
        <Title>{title}</Title>
        {!!detail && <Detail>{detail}</Detail>}
      </Cell>
      {isLast ? null : <Divider />}
    </Background>
  );
}
