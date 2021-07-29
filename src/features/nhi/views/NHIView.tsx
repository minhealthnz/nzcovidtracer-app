import { Text, VerticalSpacing } from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { Disclaimer } from "@components/molecules/Disclaimer";
import { FormV2 } from "@components/molecules/FormV2";
import { fontFamilies, fontSizes, grid2x, grid3x } from "@constants";
import { selectUser } from "@domain/user/selectors";
import { useAccessibleTitle } from "@navigation/hooks/useAccessibleTitle";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { NHIScreen } from "../screens";

const Section = styled.View`
  padding-bottom: ${grid3x}px;
  flex-direction: row;
  align-items: center;
`;
const OpenSansText = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
`;
const BoldText = styled(Text)`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.xxLarge}px;
`;
const SectionLeft = styled.View`
  flex: 1;
`;

interface Props extends StackScreenProps<MainStackParamList, NHIScreen.View> {}
export function NHIView(props: Props) {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser);
  const nhi = useMemo(() => currentUser?.nhi, [currentUser]);

  const handleEditNHI = () => {
    props.navigation.navigate(NHIScreen.Add);
  };

  const renderFooter = useCallback(
    () => (
      <>
        <VerticalSpacing height={grid2x} />
        <Disclaimer text={t("screens:viewNHI:disclaimer")} />
      </>
    ),
    [t],
  );

  useAccessibleTitle();

  if (!nhi) {
    return null;
  }

  return (
    <FormV2
      renderFooter={renderFooter}
      buttonText={t("screens:viewNHI:edit")}
      onButtonPress={handleEditNHI}
    >
      <Section>
        <OpenSansText>{t("screens:viewNHI:title")}</OpenSansText>
      </Section>
      <Divider />
      <VerticalSpacing height={grid3x} />
      <Section>
        <SectionLeft>
          <OpenSansText>{t("screens:viewNHI:nhiNumber")}</OpenSansText>
          <BoldText>{nhi}</BoldText>
        </SectionLeft>
      </Section>
    </FormV2>
  );
}
