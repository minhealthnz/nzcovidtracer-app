import { grid3x } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

import ImageButton from "./ImageButton";

const Container = styled(ImageButton)<{ paddingTop?: number }>`
  padding: 13px 13px ${grid3x}px ${grid3x}px;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
  padding-top: ${(props) => props.paddingTop || 13}px;
`;

interface Props {
  onDismiss(): void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  paddingTop?: number;
}

export function CloseButton({
  onDismiss,
  accessibilityHint,
  accessibilityLabel,
  paddingTop,
}: Props) {
  const { t } = useTranslation();

  accessibilityLabel = accessibilityLabel
    ? accessibilityLabel
    : t("accessibility:button:close");

  return (
    <Container
      image={require("@assets/images/close.png")}
      onPress={onDismiss}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      imageStyle={styles.closeButtonImage}
      paddingTop={paddingTop}
    />
  );
}

export const styles = StyleSheet.create({
  closeButtonImage: {
    width: 14.4,
    height: 14.4,
  },
});
