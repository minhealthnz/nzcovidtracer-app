import Button from "@components/atoms/Button";
import { SecondaryButton } from "@components/atoms/SecondaryButton";
import React from "react";
import { useTranslation } from "react-i18next";

export interface ButtonsProps {
  callbackEnabled: boolean;
  callbackRequested: boolean;
  appBannerLinkLabel?: string;
  onPressRequestCallback(): void;
  onPressMore(): void;
  secondaryButtonAccessibilityHint?: string;
}

export function Buttons({
  callbackEnabled,
  callbackRequested,
  onPressRequestCallback,
  onPressMore,
  appBannerLinkLabel,
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
        accessibilityHint={secondaryButtonAccessibilityHint}
      />
    );
  }

  return (
    <>
      <Button
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
        onPress={onPressMore}
        text={linkLabel}
      />
    </>
  );
}
