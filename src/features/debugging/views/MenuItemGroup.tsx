import { ReactNode } from "react";
import React from "react";
import styled from "styled-components/native";

import { sectionTitleColor } from "../colors";
import { borderRadius } from "../constants";

const Container = styled.View`
  margin: 0 12px 20px 12px;
  border-radius: ${borderRadius};
`;

const Text = styled.Text`
  color: ${sectionTitleColor};
  font-size: 10px;
  margin-left: 12px;
  margin-bottom: 4px;
`;

export interface MenuItemGroupProps {
  children: ReactNode;
  title: string;
}

export function MenuItemGroup({ title, children }: MenuItemGroupProps) {
  return (
    <>
      <Container>
        <Text key="title">{title}</Text>
        {children}
      </Container>
    </>
  );
}
