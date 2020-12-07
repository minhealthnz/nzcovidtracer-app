import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import ImageButton from "./ImageButton";

const BackButton = styled(ImageButton)`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

interface Props {
  onPress: () => void;
}

export function HeaderBackButton(props: Props) {
  const { t } = useTranslation();
  return (
    <BackButton
      image={require("@assets/icons/arrow-left.png")}
      onPress={props.onPress}
      accessibilityLabel={t("accessibility:button:back")}
    />
  );
}
