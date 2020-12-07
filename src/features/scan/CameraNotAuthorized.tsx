import { Text, VerticalSpacing } from "@components/atoms";
import { colors, fontFamilies, fontSizes, grid4x } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import styled from "styled-components/native";

const assets = {
  camera: require("@assets/images/camera.png"),
};

const CameraImage = styled.Image`
  margin-left: auto;
  margin-right: auto;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.lightYellow};
  justify-content: center;
  padding: ${grid4x}px;
`;

const OpenSettingsLink = styled.Text`
  font-family: ${fontFamilies["open-sans-bold"]};
  font-size: ${fontSizes.large}px;
  text-decoration: underline;
`;
export default function CameraNotAuthorized() {
  const { t } = useTranslation();

  return (
    <Container>
      <CameraImage
        source={assets.camera}
        accessible={true}
        accessibilityLabel={t("accessibility:graphic:cameraPermissions")}
        accessibilityRole="image"
      />
      <VerticalSpacing height={30} />
      <Text fontFamily="open-sans">{t("screens:scan:noCameraPermission")}</Text>
      <VerticalSpacing height={30} />
      <OpenSettingsLink
        onPress={Linking.openSettings}
        accessible={true}
        accessibilityLabel={t("screens:scan:openSettings")}
        accessibilityRole="button"
      >
        {t("screens:scan:openSettings")}
      </OpenSettingsLink>
    </Container>
  );
}
