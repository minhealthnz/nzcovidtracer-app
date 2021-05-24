import React from "react";
import styled from "styled-components/native";

import { PlaceHolder } from "./PlaceHolder";
import { VerticalSpacing } from "./VerticalSpacing";

export const Container = styled.View`
  padding: 20px 16px;
`;

export function ListPlaceHolder() {
  return (
    <Container>
      <PlaceHolder />
      <VerticalSpacing height={10} />
      <PlaceHolder />
      <VerticalSpacing height={10} />
      <PlaceHolder />
      <VerticalSpacing height={10} />
      <PlaceHolder />
      <VerticalSpacing height={10} />
      <PlaceHolder />
      <VerticalSpacing height={10} />
    </Container>
  );
}
