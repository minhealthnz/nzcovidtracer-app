import { VerticalSpacing } from "@components/atoms";
import { Text } from "@components/atoms/Text";
import { fontFamilies, fontSizes, grid2x, grid4x } from "@constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import styled from "styled-components/native";

import config from "../../../config";

const DescriptionBold = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.normal}px;
  text-align: left;
`;

const Description = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  margin-bottom: ${grid4x}px;
  text-align: left;
`;

const DescriptionLink = styled(DescriptionBold)`
  padding-top: 8px;
  text-decoration-line: underline;
`;

export interface ENFiOS12SupportProps {
  showLogParagraph?: boolean;
}

export function ENFiOS12Support({ showLogParagraph }: ENFiOS12SupportProps) {
  const { t } = useTranslation();

  const handleLink = useCallback(() => {
    Linking.openURL(config.iOS12SupportLink);
  }, []);

  return (
    <>
      <DescriptionBold>
        {t("screens:enfSettings:descriptioniOS12")}
      </DescriptionBold>
      <DescriptionLink onPress={handleLink}>
        {t("screens:enfSettings:descriptionLinkiOS12")}
      </DescriptionLink>
      <VerticalSpacing height={grid2x} />
      {showLogParagraph && (
        <Description>{t("screens:enfSettings:description")}</Description>
      )}
    </>
  );
}
