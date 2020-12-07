import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

const BackImage = styled.View`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export function HeaderBackImage(_props: { tintColor: string }) {
  return (
    <BackImage>
      <Image source={require("@assets/icons/arrow-left.png")} />
    </BackImage>
  );
}
