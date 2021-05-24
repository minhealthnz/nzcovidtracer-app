import Button, { presets as buttonPresets } from "@components/atoms/Button";
import {
  presets as secondaryButtonPresets,
  SecondaryButton,
} from "@components/atoms/SecondaryButton";
import { useLinking } from "@linking/useLinking";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface PanelButtonProps {
  type: "primary" | "secondary";
  text: string;
  accessibilityHint?: string;
  externalLink?: string;
  deepLink?: string;
}

export function PanelButton({
  type,
  text,
  accessibilityHint: hintOverride,
  externalLink,
  deepLink,
}: PanelButtonProps) {
  const { openExternalLink, openDeepLink } = useLinking();

  const handlePress = useCallback(() => {
    if (externalLink != null) {
      openExternalLink(externalLink);
    } else if (deepLink != null) {
      openDeepLink(deepLink);
    }
  }, [externalLink, deepLink, openExternalLink, openDeepLink]);

  const isLink = externalLink != null;

  const { t } = useTranslation();

  const accessibilityHint = useMemo(() => {
    if (hintOverride) {
      return hintOverride;
    }
    return isLink ? t("accessibility:linkAccessibilityHint") : undefined;
  }, [hintOverride, t, isLink]);

  switch (type) {
    case "primary":
      return (
        <Button
          {...buttonPresets.small}
          text={text}
          accessibilityHint={accessibilityHint}
          onPress={() => handlePress()}
        />
      );
    case "secondary":
      return (
        <SecondaryButton
          {...secondaryButtonPresets.small}
          text={text}
          onPress={() => handlePress()}
          accessibilityHint={accessibilityHint}
        />
      );
  }
}
