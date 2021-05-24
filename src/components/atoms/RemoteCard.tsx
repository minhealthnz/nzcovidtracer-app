import { Card } from "@components/molecules/Card";
import { RemoteCardData } from "@components/types";
import { useLinking } from "@linking/useLinking";
import { debounce } from "@navigation/debounce";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Share } from "react-native";

export interface RemoteCardProps {
  data: RemoteCardData;
}

export function RemoteCard({ data }: RemoteCardProps) {
  const { t } = useTranslation();

  const handleShareApp = useCallback(
    debounce(() => {
      Share.share({
        message: t("screens:dashboard:cards:unite:shareMessage"),
      });
    }),
    [],
  );

  const { openExternalLink, openDeepLink } = useLinking();

  const handlePress = useCallback(() => {
    if (data.externalLink != null) {
      openExternalLink(data.externalLink);
    } else if (data.deepLink != null) {
      openDeepLink(data.deepLink);
    } else if (data.action != null) {
      switch (data.action) {
        case "share-app":
          handleShareApp();
          break;
      }
    }
  }, [
    data.externalLink,
    data.deepLink,
    data.action,
    handleShareApp,
    openExternalLink,
    openDeepLink,
  ]);

  const isLink = data.externalLink != null;
  const accessibilityHint = isLink
    ? t("accessibility:linkAccessibilityHint")
    : undefined;

  return (
    <Card
      title={data.title}
      description={data.body}
      backgroundColor={data.backgroundColor}
      headerImage={data.icon}
      isLink={isLink}
      onPress={handlePress}
      accessibilityHint={accessibilityHint}
    />
  );
}
