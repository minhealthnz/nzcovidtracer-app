import { HiddenAccessibilityTitle } from "@components/atoms";
import Button, { ButtonProps } from "@components/atoms/Button";
import { CloseButton } from "@components/atoms/CloseButton";
import {
  SecondaryButton as BaseSecondaryButton,
  SecondaryButtonProps,
} from "@components/atoms/SecondaryButton";
import { Text } from "@components/atoms/Text";
import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { ImageSourcePropType, StyleSheet } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: white;
`;

export const HeadingText = styled(Text)`
  font-family: ${fontFamilies["open-sans-semi-bold"]};
  font-size: ${fontSizes.small}px;
  color: ${colors.primaryBlack};
  text-align: left;
  align-self: flex-start;
  margin-right: 16px;
  margin-top: 3px;
`;

// TODO Extract h1 component
const TitleText = styled(Text)`
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  padding-top: 8px;
  flex: 1;
  padding-left: 10px;
`;

const BodyText = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  padding-bottom: 4px;
`;

const HeaderImage = styled.Image`
  width: 40px;
  height: 40px;
  align-self: flex-start;
  margin-top: 6px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 0px;
`;

const _PrimaryButton = styled(Button)`
  padding: 20px 16px 20px 16px;
`;

const _SecondaryButton = styled(BaseSecondaryButton)`
  padding-top: 14px;
  padding-bottom: 20px;
`;

export const PrimaryButton = (props: ButtonProps) => {
  return <_PrimaryButton {...props} textStyle={styles.primaryButton} />;
};

export const SecondaryButton = (props: SecondaryButtonProps) => {
  return <_SecondaryButton {...props} textStyle={styles.secondaryButton} />;
};

export interface NotificationCardProps {
  icon: ImageSourcePropType;
  heading: string;
  title: string;
  body: string;
  onPressSecondaryButton(): void;
  secondaryButtonText: string;
  onDimiss(): void;
}

// TODO convert BeenInContact and BeenInCloseContact to this component,
// cause they have the same layout
export function NotificationCard({
  icon,
  heading,
  title,
  body,
  onPressSecondaryButton,
  secondaryButtonText,
  onDimiss,
}: NotificationCardProps) {
  const { t } = useTranslation();

  return (
    <Container>
      <HiddenAccessibilityTitle
        label={t("announcement:hiddenAccessibilityLabel")}
      />
      <CloseButton
        onDismiss={onDimiss}
        accessibilityLabel={t("accessibility:button:close")}
      />
      <>
        <HeadingText>{heading}</HeadingText>

        <HeaderContainer>
          <HeaderImage source={icon} width={40} height={40} />
          <TitleText>{title}</TitleText>
        </HeaderContainer>

        <BodyText>{body}</BodyText>

        <SecondaryButton
          onPress={onPressSecondaryButton}
          text={secondaryButtonText}
          align="left"
          accessibilityLabel={secondaryButtonText}
          accessibilityHint={t("announcement:linkAccessibilityHint")}
          accessibilityRole="link"
        />
      </>
    </Container>
  );
}

export const styles = StyleSheet.create({
  primaryButton: {
    fontSize: fontSizes.small,
  },
  secondaryButton: {
    fontSize: fontSizes.small,
  },
});
