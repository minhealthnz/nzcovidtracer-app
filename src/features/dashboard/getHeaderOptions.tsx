import { grid2x } from "@constants";
import { TFunction } from "i18next";
import React from "react";
import styled from "styled-components/native";

export const UniteLogo = styled.Image`
  margin-left: ${grid2x}px;
  width: 34px;
  height: 34px;
`;

export function getHeaderOptions(t: TFunction) {
  return {
    headerLeft: () => (
      <UniteLogo
        accessible
        accessibilityLabel={t("accessibility:graphic:COVID19OfficialLogo")}
        source={require("@features/dashboard/assets/icons/unite-logo.png")}
      />
    ),
  };
}
