import { Text } from "@components/atoms";
import { colors, fontSizes, grid, grid2x } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${colors.lightYellow};
  padding: ${grid2x}px;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TextView = styled.View`
  flex-direction: column;
  padding-right: ${grid}px;
  padding-left: 14px;
  flex: 1;
  margin-vertical: ${grid}px;
`;

const Title = styled(Text)`
  line-height: 20px;
`;

const Description = styled(Text)`
  line-height: 20px;
`;

const Icon = styled.Image`
  margin-top: ${grid}px;
`;

export default function DashboardFooter() {
  const { t } = useTranslation();

  return (
    <Container
      accessible={true}
      accessibilityLabel={t("screens:dashboard:footer:title")}
      accessibilityHint={t("screens:dashboard:footer:detail")}
    >
      <Icon
        source={require("../assets/icons/wash-your-hands.png")}
        width={128}
        height={128}
      />

      <TextView>
        <Title
          textAlign="left"
          fontSize={fontSizes.normal}
          fontFamily="baloo-semi-bold"
        >
          {t("screens:dashboard:footer:title")}
        </Title>

        <Description
          fontFamily="open-sans"
          fontSize={fontSizes.small}
          textAlign="left"
        >
          {t("screens:dashboard:footer:detail")}
        </Description>
      </TextView>
    </Container>
  );
}
