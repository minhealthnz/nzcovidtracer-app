import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import ImageButton from "./ImageButton";

const BackButton = styled(ImageButton)`
  margin-right: 20px;
`;

interface Props {
  onPress: () => void;
  testID?: string;
}
export function HeaderCloseButton(props: Props) {
  const { t } = useTranslation();
  return (
    <BackButton
      testID={props.testID}
      image={require("@assets/icons/close.png")}
      onPress={props.onPress}
      accessibilityLabel={t("accessibility:button:close")}
    />
  );
}
