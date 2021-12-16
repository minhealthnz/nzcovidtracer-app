import { fontSizes, grid2x } from "@constants";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";

import { Text } from "./Text";

const BulletItemRow = styled(View)`
  flex-direction: row;
  margin-bottom: ${grid2x}px;
`;

const BulletText = styled(View)`
  flex: 1;
`;

const Bullet = styled(Text)`
  padding-right: 8px;
  padding-top: 3px;
  font-size: ${fontSizes.normal}px;
`;

type BulletItemProps = {
  children: React.ReactNode;
};

export function BulletItem(props: BulletItemProps) {
  return (
    <BulletItemRow>
      <Bullet
        importantForAccessibility="no-hide-descendants"
        accessible={false}
      >
        {"\u25CF" + " "}
      </Bullet>
      <BulletText accessible={true}>{props.children}</BulletText>
    </BulletItemRow>
  );
}
