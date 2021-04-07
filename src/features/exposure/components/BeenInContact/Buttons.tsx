import { VerticalSpacing } from "@components/atoms/VerticalSpacing";
import {
  PrimaryButton,
  SecondaryButton,
} from "@components/molecules/NotificationCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityRole } from "react-native";

export interface ButtonsProps {
  callbackEnabled: boolean;
  callbackRequested: boolean;
  appBannerLinkLabel?: string;
  onPressRequestCallback(): void;
  onPressMore(): void;
  secondaryButtonAccessibilityHint?: string;
  secondaryButtonAccessibilityRole?: AccessibilityRole;
}

export function Buttons({
  callbackEnabled,
  callbackRequested,
  onPressRequestCallback,
  onPressMore,
  appBannerLinkLabel,
  secondaryButtonAccessibilityRole,
  secondaryButtonAccessibilityHint,
}: ButtonsProps) {
  const { t } = useTranslation();

  const linkLabel =
    appBannerLinkLabel || t("screens:dashboard:beenInContact:more") || "";

  if (!callbackEnabled) {
    return (
      <SecondaryButton
        accessibilityLabel={linkLabel}
        onPress={onPressMore}
        text={linkLabel}
        accessibilityRole={secondaryButtonAccessibilityRole}
        accessibilityHint={secondaryButtonAccessibilityHint}
        align="left"
      />
    );
  }

  return (
    <>
      <VerticalSpacing height={20} />
      <PrimaryButton
        buttonColor={callbackRequested ? "green" : "black"}
        text={
          callbackRequested
            ? t("screens:dashboard:beenInContact:callbackRequested")
            : t("screens:dashboard:beenInContact:requestCallback")
        }
        onPress={onPressRequestCallback}
      />

      <SecondaryButton
        accessibilityLabel={linkLabel}
        accessibilityRole={secondaryButtonAccessibilityRole}
        onPress={onPressMore}
        text={linkLabel}
      />
    </>
  );
}
